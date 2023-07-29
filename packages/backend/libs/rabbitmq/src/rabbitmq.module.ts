import { Module } from '@nestjs/common';
import { RabbitMQConnectionInjector } from './rabbitmq.connection';
import { RabbitMQClient, RabbitMQClientInjector } from './rabbitmq.client';
import { LoggerModule } from '@logger';

@Module({
  imports: [
    LoggerModule
  ],
  providers: [RabbitMQConnectionInjector, RabbitMQClient, RabbitMQClientInjector],
  exports: [RabbitMQConnectionInjector, RabbitMQClientInjector, RabbitMQClient],
})
export class RabbitmqModule { }
