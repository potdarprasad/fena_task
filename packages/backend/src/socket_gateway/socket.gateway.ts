import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SocketGatewayService } from "./socket_gateway.service";
import { LoggerService } from "@logger";

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly gatewayService: SocketGatewayService, private readonly logger: LoggerService) { }

  handleDisconnect(client: Socket) {
    const { jobId } = client.handshake.query;
    this.logger.log(`Client disconnect with jobId ${jobId}`);
  }

  async handleConnection(client: Socket) {
    const { clientId, count } = await this.gatewayService.initConnection(client);
    this.server.to(clientId).emit('message', { count });
  }

  async updateDataForClient(jobId: string, count: number) {
    const clientId = await this.gatewayService.getClientIdForJob(jobId);

    await this.gatewayService.incrementMailSentCountForJob(jobId);
    if (clientId) {
      this.server.to(clientId).emit('message', {count});
    } else {
      this.logger.warn(`Client for job ${jobId} is not connected.`);
    }
  }

  @SubscribeMessage('join')
  async handleJoinEvenet(client: Socket, payload: any) {
    console.log('***', payload);
    await this.gatewayService.deleteJob(payload.jobId);
    console.log(await this.gatewayService.getClientIdForJob(payload.jobId), '****');
    //TODO: add code here
    return {data: 'test'};
  }
}