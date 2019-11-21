import { Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { NotaryModule } from "../notary/notary.module";
import { ReportsModule } from "../reports/reports.module";
import { StorageModule } from "../storage/storage.module";
import { XmlImportModule } from "../xmlImport/xmlImport.module";
import { AuthResolver } from "./auth.resolver";
import { ConsumersResolver } from "./consumer.resolver";
import { EnergyCompanyResolver } from "./energyCompany.resolver";
import { EthereumResolver } from "./ethereum.resolver";
import { InitResolver } from "./init.resolver";
import { MetersResolver } from "./meters.resolver";
import { NotaryResolver } from "./notary.resolver";
import { ReadingsResolver } from "./readings.resolver";
import { TestResolver } from "./test.resolver";
import { CronMethodsResolver } from "./cron-methods.resolver";
import { AuthModule } from "../auth/auth.module";
import { LocalStrategy } from "../auth/local.strategy";
import { AuthService } from "../auth/auth.service";

@Module({
  imports: [
    StorageModule,
    CommonModule,
    NotaryModule,
    XmlImportModule,
    ReportsModule,
    AuthModule
  ],
  providers: [
    InitResolver,
    ReadingsResolver,
    NotaryResolver,
    EthereumResolver,
    AuthResolver,
    ConsumersResolver,
    MetersResolver,
    EnergyCompanyResolver,
    TestResolver,
    CronMethodsResolver,
    LocalStrategy,
    AuthService
  ]
})
export class ApiModule {}
