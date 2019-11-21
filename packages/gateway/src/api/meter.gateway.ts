import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Client } from "socket.io";
import { LoggerService } from "../common/logger.service";

@WebSocketGateway()
export class MeterGateway {
  constructor(private readonly logger: LoggerService) {}

  public async handleConnection() {
    this.logger.log("A client has connected", MeterGateway.name);
  }

  public async handleDisconnect() {
    this.logger.log("A client has disconnected", MeterGateway.name);
  }

  @SubscribeMessage("responseMeter")
  public async onResponseMeter(client: Client, message: unknown) {
    this.logger.log(
      `From ${client.id} got "responseMeter" message ${message}`,
      MeterGateway.name
    );
  }
}
