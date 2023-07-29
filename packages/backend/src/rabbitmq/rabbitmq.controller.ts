import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AMQP_SEND_EMAIL_QUEUE_ROUTE } from '../shared/config';
import { RabbitMQData } from '@rabbitmq';
import { RabbitmqService } from './rabbitmq.service';

@Controller('rabbitmq')
export class RabbitmqController {
    constructor(private readonly rabbitmqService: RabbitmqService){}

    @MessagePattern(AMQP_SEND_EMAIL_QUEUE_ROUTE)
    sendMails(content: RabbitMQData){
        return this.rabbitmqService.sendMails(content);
    }   
}
