import { Injectable } from "@nestjs/common";
import { RedisClientService } from "@redis-client";
import { Socket } from "socket.io";

@Injectable()
export class SocketGatewayService {
    constructor(private readonly redisClient: RedisClientService) { }

    async initConnection(client: Socket): Promise<{ count: string, clientId: string }> {
        let { jobId } = client.handshake.query;
        jobId = jobId.toString();

        const { id: clientId } = client;

        const isClientAlreadyExists = await this.redisClient.getClientId(jobId);

        if (isClientAlreadyExists) {
            const count = await this.redisClient.getMailSentCount(jobId);
            await this.redisClient.updateItemClientId(jobId, clientId);
            return { clientId, count };
        }

        await this.createNewClient(jobId, clientId);

        return { clientId, count: '1' };
    }

    async getClientIdForJob(jobId: string) {
        return this.redisClient.getClientId(jobId);
    }

    async incrementMailSentCountForJob(jobId: string, incrBy: number = 1) {
        return this.redisClient.updateMailSentCount(jobId, incrBy);
    }

    async createNewClient(jobId: string, clientId: string, count: number = 1) {
        return this.redisClient.createHMSet(jobId, clientId, count);
    }

    async deleteJob(jobId: string) {
        return this.redisClient.deleteHMSet(jobId);
    }
}