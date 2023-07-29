import { ConfigModule } from "@nestjs/config";

ConfigModule.forRoot();

export const AMQP_TOPIC_EXCHANGE = process.env.AMQP_TOPIC_EXCHANGE || 'fena_topic_exchange';
export const AMQP_DELAYED_EXCHANGE = process.env.AMQP_DELAYED_EXCHANGE || 'fena_delayed_exchange';

export const AMQP_SEND_EMAIL_QUEUE = 'amqp_send_email_queue';
export const AMQP_SEND_EMAIL_QUEUE_ROUTE = 'amqp_send_email_route';