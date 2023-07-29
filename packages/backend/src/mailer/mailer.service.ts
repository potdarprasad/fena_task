import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { SendMailInput } from './dto';
import { RabbitMQClient } from '@rabbitmq';
import { AMQP_SEND_EMAIL_QUEUE_ROUTE } from '../shared/config';

@Injectable()
export class MailerService {
    constructor(private readonly rmqClient: RabbitMQClient) { }

    async sendMail(input: SendMailInput) {
        const jobId = uuidv4();
        await this.rmqClient.sendMessageToTopic(AMQP_SEND_EMAIL_QUEUE_ROUTE, { jobId, count: input.count });
        return { message: 'Started sending mails', data: { jobId } };
    }
}
