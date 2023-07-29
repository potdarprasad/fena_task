import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './socket_gateway/socket.gateway';
import { RedisClientModule } from '@redis-client';
import { MailerController } from './mailer/mailer.controller';
import { MailerService } from './mailer/mailer.service';
import { ConfigModule } from '@nestjs/config';
import { HelpersModule } from '@helpers';
import { LoggerModule } from '@logger';
import { RabbitmqController } from './rabbitmq/rabbitmq.controller';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';
import { SocketGatewayService } from './socket_gateway/socket_gateway.service';
import { RabbitmqModule } from '@rabbitmq';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HelpersModule,
    RedisClientModule,
    RabbitmqModule,
    LoggerModule,
  ],
  controllers: [AppController, MailerController, RabbitmqController],
  providers: [ SocketGatewayService, AppGateway, MailerService, RabbitmqService],
})
export class AppModule { }
