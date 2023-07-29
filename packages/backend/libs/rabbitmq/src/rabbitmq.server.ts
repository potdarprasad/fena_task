import { CustomTransportStrategy, Server } from "@nestjs/microservices";
import { connect, Channel, Connection } from 'amqplib';
import { RabbitMQConnection } from "./rabbitmq.connection";
import { Observable } from "rxjs";
import { Logger } from "@nestjs/common";

interface QueueConfig {
  routingKeys: string[],
  queueName: string;
  exchange: string;
}

export class RabbitMQStrategy extends Server implements CustomTransportStrategy {
  connection: Connection;
  channel: Channel;
  private readonly topicQueues?: QueueConfig[]; // Array of topic queues
  private readonly delayedQueue?: QueueConfig; // Array of delayed queues
  private readonly appLogger: Logger;
  constructor(options: {
    topicQueues?: QueueConfig[],
    delayedQueue?: QueueConfig;
  }) {
    super();
    this.topicQueues = options.topicQueues;
    this.delayedQueue = options.delayedQueue;
    this.appLogger = new Logger();
  }


  async listen(callback: () => void) {
    const conn = await RabbitMQConnection.connect();
    this.connection = conn.connection();
    this.channel = await this.connection.createChannel();

    if (this.topicQueues.length) {
      await this.setupTopicQueues();
    }
    
    if(this.delayedQueue){
      await this.setupDelayedQueue()
    }

    callback();
  }

  private async setupTopicQueues() {
    for (const queue of this.topicQueues) {
      // assert the exchange to be topic
      await this.channel.assertExchange(queue.exchange, 'topic', {
        durable: true,
      });

      await this.channel.assertQueue(queue.queueName, {
        durable: true
      });

      queue.routingKeys.forEach(pattern => {
        this.channel.bindQueue(queue.queueName, queue.exchange, pattern);
      });
      this.consumeQueue(queue.queueName);
    }

  }

  private async setupDelayedQueue() {
    // assert the exchange to be topic
    await this.channel.assertExchange(this.delayedQueue.exchange, 'x-delayed-message', {
      durable: true,
      arguments: { 'x-delayed-type': 'direct' },
    });

    await this.channel.assertQueue(this.delayedQueue.queueName, {
      durable: true
    });

    this.delayedQueue.routingKeys.forEach(pattern => {
      this.channel.bindQueue(this.delayedQueue.queueName, this.delayedQueue.exchange, pattern);
    });
    this.consumeQueue(this.delayedQueue.queueName);
  }

  private async consumeQueue(queue: string) {
    await this.channel.consume(queue, this.handleMessage.bind(this), { noAck: true });
  }

  private async handleMessage(message) {
    try {
      await this.handleMessageHelper(message);
    } catch (error) {
      this.channel.nack(message, false, false);
    }
  }

  private async handleMessageHelper(message) {
    const { content } = message;
    let messageObj = JSON.parse(content.toString());
    const pattern = message.fields ? message.fields.routingKey : null;
    const handler = this.getHandlerByPattern(pattern);
    if (!handler) {
      this.channel.nack(message, false, false);
      return;
    }

    const messageHandlerMethods = (() => {
      const _channel = this.channel;
      const _message = message;
      return {
        ack: () => {
          _channel.ack(_message);
          // tslint:disable-next-line:max-line-length
          this.appLogger.log(
            'info',
            `Rabbitmq message acknowledged. Message Properties - ${JSON.stringify(message.fields)}, Message Content - ${JSON.stringify(
              messageObj,
            )}`,
          );
        },
        nack: (requeue = true) => {
          // TODO: Implement requeue after redelivery count feature is added to rabbitmq
          // See - https: // github.com/rabbitmq/rabbitmq-server/issues/502
          if (requeue) {
            const redelivered = _message.fields.redelivered;
            const noOfRetries = _message.fields.deliveryTag;
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:max-line-length
            this.appLogger.error(`Rabbitmq message cannot be acknowledged. Message Properties - ${JSON.stringify(message.fields)}, Message Content - ${messageObj}`);
            if (redelivered && +noOfRetries === 5) {
              requeue = false;
            }
          }
          _channel.nack(message, false, false);
        },
      };
    })();
    messageObj = {
      ...messageObj,
      ...messageHandlerMethods,
    };
    this.transformToObservable(await handler(messageObj)) as Observable<any>;
  }

  close() {
    this.channel.close();
    this.connection.close();
  }
}