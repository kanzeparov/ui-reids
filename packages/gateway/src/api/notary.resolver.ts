import { Args, Query, Resolver } from '@nestjs/graphql';
import axios from 'axios';
import moment from 'moment';
import { LoggerService } from '../common/logger.service';
import { ConsumersService } from '../storage/consumers.service';
import { EnergyCompanyService } from '../storage/energy_company.service';
// import { NotaryService } from "../notary/notary.service";
import { MetersService } from '../storage/meters.service';
import { ReadingsService } from '../storage/readings.service';
import { RelUsersEcService } from '../storage/relUsersEc.service';
import { Stamp } from '../storage/stamp.entity';
import { StampsService } from '../storage/stamps.service';
import { UsersService } from '../storage/users.service';
import { ConfigService } from '../config/config.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../storage/user.entity';
import { DateTime } from 'luxon';

@Resolver()
export class NotaryResolver {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    // private readonly notaryService: NotaryService,
    private readonly readingsService: ReadingsService,
    private readonly metersService: MetersService,
    private readonly stampsService: StampsService,
    private readonly usersService: UsersService,
    private readonly consumersService: ConsumersService,
    private readonly energyCompanyService: EnergyCompanyService,
    private readonly relUsersEcService: RelUsersEcService,
  ) {}

  private contractsURl = this.configService.NOTARIZATION_MODULE_URL;

  @Query('notarizationCheckTest')
  public async notarizationCheckTest(): Promise<any> {
    const day = moment('2019-07-09 12:00:00');
    const { data: responseNotarization } = await axios.post(`${this.contractsURl}${'/timestamp/add'}`, {
      date: day.unix().toString(),
      entries: [
        {
          id: 285,
          consumer: 'ООО "ТехСтрой"',
          meter: 'ПСЧ-4ТМ.05М № 5',
          timestamp: '2019-07-08T11:00:00.000Z',
          activePower: '17.2',
          reactivePower: '17.2',
          fullPower: '17.2',
        },
      ],
    });
    this.logger.debug({
      responseNotarization,
    });
  }
  @Query('notarizationAdd')
  public async notarizationAdd(): Promise<any> {
    this.logger.log('Serving `notarizationAdd` query', NotaryResolver.name);
    // return this.notaryService.notarizeAll();
    const meters = await this.metersService.all();
    const day = moment('2019-07-09 12:00:00');
    const { data: responseNotarization } = await axios.post(`${this.contractsURl}${'/timestamp/add'}`, {
      date: day.unix().toString(),
      entries: [
        {
          id: 285,
          consumer: 'ООО "ТехСтрой"',
          meter: 'ПСЧ-4ТМ.05М № 5',
          timestamp: '2019-07-08T11:00:00.000Z',
          activePower: '17.2',
          reactivePower: '17.2',
          fullPower: '17.2',
        },
      ],
    });
    const newStamp = new Stamp();
    newStamp.meter = meters[0];
    newStamp.day = day.toDate();
    newStamp.ethereumTxid = responseNotarization.txHash;
    (newStamp.timestamp = moment().toDate()), (newStamp.dataHash = responseNotarization.dataHash);
    this.stampsService.save(newStamp);
  }

  @Query('notarizationStart')
  public async notarizationStart() {
    this.logger.log('Serving `notarizationStart` query', NotaryResolver.name);
    // this.readingsService.
    const startOfDay = moment()
      .subtract(1, 'day')
      .utc()
      .startOf('day');
    const endOfDay = moment()
      .subtract(1, 'day')
      .utc()
      .endOf('day');
    const meters = await this.metersService.all();
    const date = startOfDay.unix().toString();

    for (const meter of meters) {
      this.logger.log(`notarize start meterId = ${meter.id}`);
      const readings = await this.readingsService.byWindowPerMeter(startOfDay.toDate(), endOfDay.toDate(), meter);
      if (!readings.length) {
        this.logger.debug(`meter not data in day ${meter.id} - ${startOfDay.toString()}`);
        continue;
      }
      const entries = readings.map(r => {
        return {
          id: r.id,
          consumer: r.meter.consumer.name,
          meter: r.meter.name,
          timestamp: r.timestamp,
          activePower: r.activePower,
          reactivePower: r.activePower,
          fullPower: r.activePower,
        };
      });
      const { data: responseNotarization } = await axios.post(`${this.contractsURl}${'/timestamp/add'}`, {
        date,
        entries,
      });
      const newStamp = new Stamp();
      newStamp.meter = meter;
      newStamp.day = startOfDay.toDate();
      newStamp.ethereumTxid = responseNotarization.txHash;
      (newStamp.timestamp = moment().toDate()), (newStamp.dataHash = responseNotarization.dataHash);
      this.stampsService.save(newStamp);
      this.logger.log(`notarize end meterId = ${meter.id}`);
    }
    return {
      action: 'Doing Nothing',
    };
  }

  public async checkStamp(stamp: Stamp): Promise<any> {
    this.logger.debug(`checkStamp ${stamp.id}`);
    const startOfDay = moment(stamp.day)
      .utc()
      .startOf('day');
    const endOfDay = moment(stamp.day)
      .utc()
      .endOf('day');
    const readings = await this.readingsService.byWindowPerMeter(startOfDay.toDate(), endOfDay.toDate(), stamp.meter);
    const entries = readings.map(r => {
      return {
        id: r.id,
        consumer: r.meter.consumer.name,
        meter: r.meter.name,
        timestamp: r.timestamp,
        activePower: r.activePower,
        reactivePower: r.activePower,
        fullPower: r.activePower,
      };
    });
    const date = moment(stamp.day)
      .unix()
      .toString();
    try {
      const { data } = await axios.post(`${this.contractsURl}${'/timestamp/check'}`, {
        date,
        entries,
      });
      this.logger.debug({
        data,
      });
      stamp.notarized = true;
    } catch (error) {
      this.logger.error(error);
      stamp.notarized = false;
    }
    stamp.lastCheckTimestamp = moment().toDate();
    await this.stampsService.save(stamp);
  }

  @Query('notarizationCheck')
  public async notarizationCheck() {
    this.logger.log(`Serving \`notarizationCheck\` query`, NotaryResolver.name);
    const stamps = await this.stampsService.all();
    for (const stamp of stamps) {
      await this.checkStamp(stamp);
    }
  }

  @Query('notarizedData')
  @UseGuards(GqlAuthGuard)
  public async notarizedData(@CurrentUser() user: User) {
    const list = await this.relUsersEcService.getAllEnergyCompaniesByUser(user);
    const companies = await list.map(item => item.energyCompany);
    const consumersList = await this.consumersService.getByEnergyCompanyIds(companies.map(c => c.id));
    const metersList = await this.metersService.getByConsumersList(consumersList.map(c => c.id));
    this.logger.log(`Serving \`notarizedData\` query`, NotaryResolver.name);
    const stamps = await this.stampsService.getByMeterIds(metersList.map(m => m.id));
    return stamps.map(stamp => {
      const date = DateTime.fromJSDate(stamp.day).setZone(user.tz);
      return {
        date: date.toISO(),
        lastCheckDate: stamp.lastCheckTimestamp,
        address: stamp.ethereumTxid,
        dataHash: stamp.dataHash,
        notarized: stamp.notarized,
        meterName: stamp.meter.name,
        meterId: stamp.meter.id,
      };
    });
  }
}
