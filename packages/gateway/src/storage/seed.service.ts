import { Injectable } from "@nestjs/common";
import * as _ from "lodash";
import moment from "moment";
import { Role } from "./role.entity";
import { RolesService } from "./roles.service";

import { LoggerService } from "../common/logger.service";
import { Consumer } from "./consumer.entity";
import { ConsumersService } from "./consumers.service";

import { User } from "./user.entity";
import { UsersService } from "./users.service";

import { EnergyCompany } from "./energy_company.entity";
import { EnergyCompanyService } from "./energy_company.service";

import { RelUsersEc } from "./relUsersEc.entity";
import { RelUsersEcService } from "./relUsersEc.service";

import { Meter } from "./meter.entity";
import { MetersService } from "./meters.service";
import { Reading } from "./reading.entity";
import { ReadingsService } from "./readings.service";

@Injectable()
export class SeedService {
  constructor(
    private readonly rolesService: RolesService,
    private readonly consumersService: ConsumersService,
    private readonly energyCompanyService: EnergyCompanyService,
    private readonly metersService: MetersService,
    private readonly readingsService: ReadingsService,
    private readonly usersService: UsersService,
    private readonly relUsersEcService: RelUsersEcService,
    private readonly logger: LoggerService
  ) {}

  public async initUsers(): Promise<boolean> {
    const ROLES_SEEDS = ["superuser", "user"];
    const roles = await Promise.all<Role>(
      ROLES_SEEDS.map(async roleName => {
        const role = new Role();
        role.name = roleName;
        return this.rolesService.save(role);
      })
    );
    const USERS_SEEDS = [
      {
        login: "mosenergosbyt",
        password: "123",
        role: roles[1]
      },
      {
        login: "altajenergosbyt",
        password: "123",
        role: roles[1]
      },
      {
        login: "interrao",
        password: "123456",
        role: roles[0]
      }
    ];
    const users = await Promise.all<User>(
      USERS_SEEDS.map(async userIns => {
        const user = new User();
        user.login = userIns.login;
        user.role = userIns.role;
        user.password = this.usersService.passwordHash(userIns.password);
        return this.usersService.save(user);
      })
    );
    return true;
  }

  public async interStart(): Promise<boolean> {
    const ROLES_SEEDS = ["superuser", "user"];
    const roles = await Promise.all<Role>(
      ROLES_SEEDS.map(async roleName => {
        const role = new Role();
        role.name = roleName;
        return this.rolesService.save(role);
      })
    );
    this.logger.log(`Added ${roles.length} roles`, SeedService.name);
    this.logger.debug(roles);

    const USERS_SEEDS = [
      {
        login: "login1",
        password: "123",
        role: roles[1]
      },
      {
        login: "login2",
        password: "123",
        role: roles[1]
      },
      {
        login: "login3",
        password: "123",
        role: roles[0]
      }
    ];
    const users = await Promise.all<User>(
      USERS_SEEDS.map(async userIns => {
        const user = new User();
        user.login = userIns.login;
        user.role = userIns.role;
        user.password = this.usersService.passwordHash(userIns.password);
        return this.usersService.save(user);
      })
    );
    this.logger.log(`Added ${users.length} users`, SeedService.name);
    this.logger.debug(users);

    const EC_SEEDS = [
      {
        name: "Алтайэнергосбыт"
      },
      {
        name: "Мосэнергосбыт"
      },
      {
        name: "Петербугская Сбытовая Компания"
      }
    ];
    const eCompanies = await Promise.all<EnergyCompany>(
      EC_SEEDS.map(async ecIns => {
        const ec = new EnergyCompany();
        Object.assign(ec, ecIns);
        return this.energyCompanyService.save(ec);
      })
    );
    this.logger.log(
      `Added ${eCompanies.length} energy_company`,
      SeedService.name
    );

    //
    const REL_USERS_EC_SEEDS = [
      {
        user: users[0],
        energyCompany: eCompanies[0]
      },
      {
        user: users[1],
        energyCompany: eCompanies[1]
      },
      {
        user: users[2],
        energyCompany: eCompanies[1]
      },
      {
        user: users[2],
        energyCompany: eCompanies[0]
      }
    ];
    const relUsersEcItems = await Promise.all<RelUsersEc>(
      REL_USERS_EC_SEEDS.map(async itemIns => {
        const item = new RelUsersEc();
        Object.assign(item, itemIns);
        return this.relUsersEcService.save(item);
      })
    );
    this.logger.log(
      `Added ${relUsersEcItems.length} rel_users_ec`,
      SeedService.name
    );

    const CONSUMERS_SEEDS = [
      {
        name: `ООО "ТехСтрой"`,
        address: `Алтайский край, г. Барнаул, пр. Калинина, 57`,
        inn: `2221181207`,
        energyCompany: eCompanies[0]
      },
      {
        name: `Тестовый Потребитель 2`,
        address: `Ульяновск`,
        inn: `2123456789`,
        energyCompany: eCompanies[1]
      },
      {
        name: `Тестовый Потребитель 3`,
        address: `Казань`,
        inn: `3123456789`,
        energyCompany: eCompanies[1]
      },
      {
        name: `Тестовый Потребитель 4`,
        address: `Москва`,
        inn: `4123456789`,
        energyCompany: eCompanies[0]
      }
    ];
    const consumers = await Promise.all<Consumer>(
      CONSUMERS_SEEDS.map(async consumerIns => {
        const consumer = new Consumer();
        Object.assign(consumer, consumerIns);
        return this.consumersService.save(consumer);
      })
    );
    this.logger.log(`Added ${consumers.length} consumers`, SeedService.name);

    const METER_SEED = [
      {
        meterAccount: "",
        name: "ПСЧ-4ТМ.05М № 1",
        address: "1",
        consumer: consumers[0]
      },
      {
        meterAccount: "",
        name: "ПСЧ-4ТМ.05М № 2",
        address: "2",
        consumer: consumers[1]
      },
      {
        meterAccount: "",
        name: "ПСЧ-4ТМ.05М № 3",
        address: "3",
        consumer: consumers[2]
      },
      {
        meterAccount: "",
        name: "ПСЧ-4ТМ.05М № 4",
        address: "4",
        consumer: consumers[3]
      },
      {
        meterAccount: "",
        name: "ПСЧ-4ТМ.05М № 5",
        address: "5",
        consumer: consumers[0]
      },
      {
        meterAccount: "",
        name: "ПСЧ-4ТМ.05М № 6",
        address: "6",
        consumer: consumers[1]
      },
      {
        meterAccount: "",
        name: "ПСЧ-4ТМ.05М № 7",
        address: "7",
        consumer: consumers[2]
      },
      {
        meterAccount: "",
        name: "ПСЧ-4ТМ.05М № 8",
        address: "8",
        consumer: consumers[3]
      }
    ];
    const meters = await Promise.all<Meter>(
      METER_SEED.map(async meterSeed => {
        const meter = new Meter();
        meter.meterAccount = meterSeed.meterAccount;
        meter.name = meterSeed.name;
        meter.address = meterSeed.address;
        meter.consumer = meterSeed.consumer;
        return this.metersService.save(meter);
      })
    );
    this.logger.log(`Added ${meters.length} meters`, SeedService.name);

    const dateSet = moment()
      .utcOffset(0)
      .startOf("hour");
    for (let i = 1; i <= 100; i += 1) {
      const date = dateSet.subtract(30, "minutes");
      // tslint:disable-next-line: await-promise
      for await (const meter of meters) {
        const reading = new Reading();
        reading.timestamp = date.toDate();
        reading.activePower = _.floor(_.random(0, 20, true), 1);
        reading.reactivePower = _.floor(_.random(0, 20, true), 1);
        reading.meter = meter;
        await this.readingsService.save(reading);
      }
    }
    this.logger.log(`Added readings`, SeedService.name);

    return true;
  }
}
