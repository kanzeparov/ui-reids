import { Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { LoggerService } from "../common/logger.service";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { StorageModule } from "../storage/storage.module";
import { ReportsService } from "./reports.service";
import { ReportsController } from "./reports.controller";

@Module({
  imports: [ConfigModule, CommonModule, StorageModule],
  providers: [ConfigService, LoggerService, ReportsService, ReportsController],
  controllers: [ReportsController],
  exports: [ReportsService]
})
export class ReportsModule {}
