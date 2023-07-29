import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AMQP_SEND_EMAIL_QUEUE, AMQP_SEND_EMAIL_QUEUE_ROUTE, AMQP_TOPIC_EXCHANGE } from './shared/config';
import { RabbitMQStrategy } from '@rabbitmq';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT') || 3000;

  const rabbitmqServer = new RabbitMQStrategy({
    topicQueues: [
      {
        queueName: AMQP_SEND_EMAIL_QUEUE,
        exchange: AMQP_TOPIC_EXCHANGE,
        routingKeys: [AMQP_SEND_EMAIL_QUEUE_ROUTE]
      },
    ],

  });

  app.connectMicroservice({
    strategy: rabbitmqServer,
  });

  await app.startAllMicroservices();

  app.setGlobalPrefix('/api');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
}

bootstrap();
