import { ConfigModule } from "@nestjs/config";

ConfigModule.forRoot();
export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
export const AMQP_TOPIC_EXCHANGE = process.env.AMQP_TOPIC_EXCHANGE || 'fena_topic_exchange';
export const AMQP_DELAYED_EXCHANGE = process.env.AMQP_DELAYED_EXCHANGE || 'fena_delayed_exchange';