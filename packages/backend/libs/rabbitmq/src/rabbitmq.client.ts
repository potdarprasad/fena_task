import { Injectable } from '@nestjs/common';
import { Channel, Connection, Options } from 'amqplib';
import { Buffer } from 'buffer';
import { RabbitMQConnection } from './rabbitmq.connection';
import { AMQP_DELAYED_EXCHANGE, AMQP_TOPIC_EXCHANGE } from './rabbitmq.config';

let connection: RabbitMQConnection = null;
let client: RabbitMQClient = null;

@Injectable()
export class RabbitMQClient {
    constructor(private publishChannel: Channel) { }

    public static async create(conn: Connection): Promise<RabbitMQClient> {
        const publishChannel = await conn.createChannel();
        return new RabbitMQClient(publishChannel);
    }

    public async sendMessageToTopic(address: string, data: any, priority?: number) {
        const buffer = Buffer.from(
            JSON.stringify({
                data
            }),
        );
        const options: Options.Publish = {
            persistent: true,
        };
        if (priority) options.priority = priority;
        
        return this.publishChannel.publish(AMQP_TOPIC_EXCHANGE, address, buffer, {
            persistent: true,
            priority: 1,
        });
    }

    public async sendMessageToDelayedQueue(address: string, data: any, delay: number) {
        const buffer = Buffer.from(
            JSON.stringify({
                data,
            }),
        );
        return this.publishChannel.publish(AMQP_DELAYED_EXCHANGE, address, buffer, {
            persistent: true,
            headers: {
                'x-delay': delay,
            },
        });
    }
}

export const RabbitMQClientInjector = {
    provide: RabbitMQClient,
    useFactory: async () => {
        if (!connection) connection = await RabbitMQConnection.connect();
        if (!client) client = await RabbitMQClient.create(connection.connection());
        return client;
    },
};
