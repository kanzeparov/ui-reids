import { Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { LoggerService } from "../common/logger.service";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { StorageModule } from "../storage/storage.module";
import { EthereumService } from "./ethereum.service";
import { NotaryService } from "./notary.service";
import { PackingService } from "./packing.service";

@Module({
  imports: [ConfigModule, CommonModule, StorageModule],
  providers: [
    ConfigService,
    EthereumService,
    NotaryService,
    LoggerService,
    PackingService
  ],
  exports: [NotaryService, EthereumService]
})
export class NotaryModule {}
