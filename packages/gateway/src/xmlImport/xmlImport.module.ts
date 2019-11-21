import { Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { LoggerService } from "../common/logger.service";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { StorageModule } from "../storage/storage.module";
import { XmlImportService } from "./xmlImport.service";
import { EmailParseService } from "./emailParse.service";

@Module({
  imports: [ConfigModule, CommonModule, StorageModule],
  providers: [
    ConfigService,
    LoggerService,
    XmlImportService,
    EmailParseService
  ],
  exports: [XmlImportService, EmailParseService]
})
export class XmlImportModule {}
