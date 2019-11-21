import { Args, Query, Resolver } from '@nestjs/graphql';
import moment from 'moment';
import { LoggerService } from '../common/logger.service';
import { ConsumersService } from '../storage/consumers.service';
import { MetersService } from '../storage/meters.service';
import { ReadingsService } from '../storage/readings.service';
import { RelUsersEcService } from '../storage/relUsersEc.service';
import { UsersService } from '../storage/users.service';
import { Reading } from '../storage/reading.entity';
import { IOrderField } from '../common/IOrderField';
import { User } from '../storage/user.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { DateTime } from 'luxon';

@Resolver()
export class ReadingsResolver {
  constructor(
    private readonly logger: LoggerService,
    private readonly readingsService: ReadingsService,
    private readonly usersService: UsersService,
    private readonly consumersService: ConsumersService,
    private readonly metersService: MetersService,
    private readonly relUsersEcService: RelUsersEcService,
  ) {}

  private async getReadings(
    user: User,
    fromDate?: Date,
    toDate?: Date,
    energyCompanyId?: number,
    consumerId?: number,
    meterId?: number,
    page?: number,
    pageSize?: number,
    sort?: IOrderField[],
  ): Promise<{ readings: any[]; pages: number; countItems: number }> {
    this.logger.log(`Serving "readingsGetList" query from=${fromDate}, to=${toDate}`, ReadingsResolver.name);
    const list = await this.relUsersEcService.getAllEnergyCompaniesByUser(user);
    const companies = await list.map(item => item.energyCompany);

    let idsCompanies: number[] = [];
    idsCompanies = companies.map(c => c.id);
    if (energyCompanyId) {
      const foundECById = companies.find(c => c.id === energyCompanyId);
      if (!foundECById) {
        throw new Error(`energy company (id = ${energyCompanyId}) unavailable to this user`);
      }
      idsCompanies = [energyCompanyId];
    }
    const consumersList = await this.consumersService.getByEnergyCompanyIds(idsCompanies);

    let idsConsumers: number[] = [];
    idsConsumers = consumersList.map(c => c.id);
    if (consumerId) {
      const found = consumersList.find(c => c.id === consumerId);
      if (!found) {
        throw new Error(`consumer (id = ${consumerId}) unavailable to this user and selected energy company`);
      }
      idsConsumers = [consumerId];
    }

    const metersList = await this.metersService.getByConsumersList(idsConsumers);
    let meterIds: number[] = [];
    meterIds = metersList.map(m => m.id);
    if (meterId) {
      const found = metersList.find(c => c.id === meterId);
      if (!found) {
        throw new Error(`meter (id = ${meterId}) unavailable to this user and selected energy company and consumer`);
      }
      meterIds = [meterId];
    }
    let readings: Reading[] = [];
    let pages = 0;
    const { pagesCount, readings: _readings, countItems } = await this.readingsService.getByMeterIdsPaging({
      meterIds,
      page,
      pageSize,
      sort,
      from: fromDate,
      to: toDate,
    });
    readings = _readings;
    pages = pagesCount;
    return {
      readings: readings.map(r => {
        const localTime = DateTime.fromJSDate(r.timestamp).setZone(r.meter.tz)
        return {
          endPeriod: localTime.toISO(),
          powerActive: r.activePower,
          powerReactive: r.reactivePower,
          fullPower: r.reactivePower,
          meterName: r.meter.name,
          meterId: r.meter.id,
          consumer: r.meter.consumer.name,
        };
      }),
      pages,
      countItems,
    };
  }

  @Query('readingsGetListPaging')
  @UseGuards(GqlAuthGuard)
  public async readingsGetListPaging(
    @CurrentUser() user: User,
    @Args('fromDate') fromDate: Date,
    @Args('toDate') toDate: Date,
    @Args('energyCompanyId') energyCompanyId?: number,
    @Args('consumerId') consumerId?: number,
    @Args('meterId') meterId?: number,
    @Args('page') page?: number,
    @Args('pageSize') pageSize?: number,
    @Args('sort') sort?: IOrderField[],
  ) {
    // tslint:disable-next-line:max-line-length
    const { pages, readings, countItems } = await this.getReadings(
      user,
      fromDate,
      toDate,
      energyCompanyId,
      consumerId,
      meterId,
      page,
      pageSize,
      sort,
    );
    return {
      pages,
      items: readings,
      countItems,
    };
  }

  @Query('readingsGetList')
  @UseGuards(GqlAuthGuard)
  public async readingsGetList(
    @CurrentUser() user: User,
    @Args('fromDate') fromDate?: Date,
    @Args('toDate') toDate?: Date,
    @Args('energyCompanyId') energyCompanyId?: number,
    @Args('consumerId') consumerId?: number,
    @Args('meterId') meterId?: number,
    @Args('page') page?: number,
    @Args('pageSize') pageSize?: number,
    @Args('sort') sort?: IOrderField[],
  ) {
    const { pages, readings } = await this.getReadings(
      user,
      fromDate,
      toDate,
      energyCompanyId,
      consumerId,
      meterId,
      page,
      pageSize,
      sort,
    );
    return readings;
  }

  @Query('getMeterDataOfLastDay')
  public async lastDay() {
    this.logger.log('Serving `getMeterDataOfLastDay` query', ReadingsResolver.name);
    const startOfDay = moment()
      .startOf('day')
      .toDate();
    const endOfDay = moment()
      .endOf('day')
      .toDate();
    const readings = await this.readingsService.byWindow(startOfDay, endOfDay);
    return readings.map(r => {
      return {
        timestamp: r.timestamp.toISOString(),
        activePower: r.activePower,
        reactivePower: r.reactivePower,
        fullPower: r.reactivePower,
        meter: r.meter.name,
        consumer: r.meter.consumer.name,
      };
    });
  }

  @Query('transactions')
  public async all(@Args('fromDate') from: Date, @Args('toDate') to: Date) {
    this.logger.log(`Serving \`getMeterDataOfLastDay\` query; from=${from}, to=${to}`, ReadingsResolver.name);
    const readings = await this.readingsService.byWindow(from, to);
    return readings.map(r => {
      return {
        consumer: r.meter.consumer.name,
        meterName: r.meter.name,
        meterId: r.meter.id,
        endPeriod: r.timestamp.toISOString(),
        powerActive: r.activePower,
        powerReactive: r.reactivePower,
      };
    });
  }
}
