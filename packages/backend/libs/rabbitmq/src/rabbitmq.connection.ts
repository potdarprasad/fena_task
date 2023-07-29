import { Connection, connect } from 'amqplib';
import { RABBITMQ_URL } from './rabbitmq.config';
import { ConfigService } from '@nestjs/config';

export class RabbitMQConnection {
    constructor(
        private _connection: Connection
    ) {}

    public static async connect(): Promise<RabbitMQConnection> {
        const connection: Connection = await connect(RABBITMQ_URL);
        return new RabbitMQConnection(connection);
    }

    public connection(): Connection {
        return this._connection;
    }
}

export const RabbitMQConnectionInjector = {
    provide: 'RabbitMQConnection',
    useFactory: async () => {
        return await RabbitMQConnection.connect();
    },
};
