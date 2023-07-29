import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisClientService {
    constructor(@InjectRedis() private readonly client: Redis) { }

    createHMSet(jobId: string, clientId: string, count: number = 0) {
        return this.client.hmset(jobId, {
            clientId,
            count
        });
    }

    deleteHMSet(jobId: string){
        return this.client.del(jobId);
    }

    async isHMSetAlreadyExists(jobId: string){
        const isExists = await this.client.exists(jobId) ;
        return isExists === 1;
    }

    getMapByJobId(jobId: string) {
        return this.client.hmget(jobId);
    }

    getMailSentCount(jobId: string){
        return this.client.hget(jobId, 'count');
    }

    getClientId(jobId: string){
        return this.client.hget(jobId, 'clientId');
    }

    updateMailSentCount(itemId, incrementBy = 1) {
        return this.client.hincrby(itemId, 'count', incrementBy);
    }

    updateItemClientId(itemId, newClientId) {
        this.client.hset(itemId, 'clientId', newClientId);
    }
}
