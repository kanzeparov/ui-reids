import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "../common/common.module";
import { LoggerService } from "../common/logger.service";
import { DatabaseModule } from "../database/database.module";
import { Consumer } from "./consumer.entity";
import { ConsumersService } from "./consumers.service";
import { EnergyCompany } from "./energy_company.entity";
import { EnergyCompanyService } from "./energy_company.service";
import { Meter } from "./meter.entity";
import { MetersService } from "./meters.service";
import { Reading } from "./reading.entity";
import { ReadingsService } from "./readings.service";
import { RelUsersEc } from "./relUsersEc.entity";
import { RelUsersEcService } from "./relUsersEc.service";
import { Role } from "./role.entity";
import { RolesService } from "./roles.service";
import { SeedService } from "./seed.service";
import { Stamp } from "./stamp.entity";
import { StampsService } from "./stamps.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

@Module({
  imports: [
    DatabaseModule,
    CommonModule,
    TypeOrmModule.forFeature([
      Consumer,
      Meter,
      Reading,
      Stamp,
      Role,
      User,
      EnergyCompany,
      RelUsersEc
    ])
  ],
  providers: [
    LoggerService,
    SeedService,
    ConsumersService,
    MetersService,
    ReadingsService,
    StampsService,
    RolesService,
    UsersService,
    EnergyCompanyService,
    RelUsersEcService
  ],
  exports: [
    SeedService,
    ConsumersService,
    MetersService,
    ReadingsService,
    StampsService,
    RolesService,
    UsersService,
    EnergyCompanyService,
    RelUsersEcService
  ]
})
export class StorageModule {}
