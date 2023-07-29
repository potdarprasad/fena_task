import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';
import { RabbitMQData } from '@rabbitmq';
import { AppGateway } from '../socket_gateway/socket.gateway';

@Injectable()
export class RabbitmqService {
    constructor(
        private readonly logger: LoggerService,
        private readonly socketGateway: AppGateway
    ) { }

    async sendMails(input: RabbitMQData) {
        try {
            const { jobId, count } = input.data;
            await this.processMailSending(jobId, count);
        } catch (error) {
            this.logger.error(error);
        }
    }

    async processMailSending(jobId: string, count: number) {
        for (let i = 1; i <= count; i++) {
            this.logger.log(`Sending mails for ${jobId}: mail count ${i}`);
            await this.socketGateway.updateDataForClient(jobId, i);
            await this.sleep(200);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
