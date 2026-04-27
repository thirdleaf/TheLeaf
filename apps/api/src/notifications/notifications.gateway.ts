import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@WebSocketGateway({ cors: { origin: "*" } })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    
    if (userId) {
      client.join(`user_${userId}`);
      this.logger.log(`Client connected and joined room user_${userId}: ${client.id}`);
    } else {
      this.logger.warn(`Client ${client.id} connected without userId identifier. Disconnecting...`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  notifyUser(userId: string, event: string, payload: any) {
    this.server.to(`user_${userId}`).emit(event, payload);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  handleRiskChecks() {
    this.logger.debug("Executing global 60s risk bounding check across all active clients...");
    // Mock simulation: If a user has exceeded their dailyLossLimit
    // In reality: Check active memory map or DB snapshot
    // this.notifyUser(userId, "alert:triggered", { type: "DAILY_LOSS_LIMIT_BREACH", message: "Rule bound breached! Trading disabled.", severity: "high" });
  }
}
