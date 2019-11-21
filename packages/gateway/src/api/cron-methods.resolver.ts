import moment  from 'moment';
import oracledb from 'oracledb';
import { Query, Resolver } from '@nestjs/graphql';
import { LoggerService } from '../common/logger.service';
import { ReadingsService } from '../storage/readings.service';
import { Reading } from '../storage/reading.entity';
import { EnergyCompany } from '../storage/energy_company.entity';
import { EnergyCompanyService } from '../storage/energy_company.service';
import { Meter } from '../storage/meter.entity';
import { MetersService } from '../storage/meters.service';
import { ConsumersService } from '../storage/consumers.service';
import { Consumer } from '../storage/consumer.entity';

@Resolver()
export class CronMethodsResolver {
  constructor(
    private readonly readingsService: ReadingsService,
    private readonly energyCompanyService: EnergyCompanyService,
    private readonly consumersService: ConsumersService,
    private readonly metersService: MetersService,
    private readonly logger: LoggerService,
  ) {}

  private async oracleGetData(day: Date): Promise<any[]> {
    let connection;
    let resultRows: any[] = [];
    const fromDate = moment(day)
      .subtract(1, 'day')
      .format('DD.MM.YYYY')
      .toString();
    const toDate = moment(day)
      .add(1, 'day')
      .format('DD.MM.YYYY')
      .toString();
    this.logger.debug({
      fromDate,
      toDate,
    });
    try {
      connection = await oracledb.getConnection({
        user: 'AGREGATORS',
        password: 'Sku$leic57',
        connectString: '10.195.238.105/orcl1',
      });

      let result = await connection.execute(
        `
        select 
        a."SYB_RNK",
        a."N_FID",
        a."N_GR_TY",
        a."N_SH",
        a."DD_MM_YYYY",
        a."N_INTER_RAS",
        a."KOL_DB",
        a."KOL",
        a."VAL",
        a."STAT",
        a."MIN_0",
        a."MIN_1",
        a."INTERV",
        a."AK_SUM",
        a."POK_START",
        a."RASH_POLN",
        a."IMPULSES" from CNT.VIEW_FOR_AGR_SPROSA A 
        WHERE 
        DD_MM_YYYY > to_date(:fromDate,'DD.MM.YYYY') 
        AND DD_MM_YYYY < to_date(:toDate,'DD.MM.YYYY')     
        `,
        [fromDate, toDate], // bind value for :id
      );
      // console.log(result.rows);
      this.logger.debug({
        rowsL: result.rows.length,
      });
      resultRows = result.rows;
    } catch (err) {
      // console.error(err);
      this.logger.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          // console.error(err);
          this.logger.error(err);
        }
      }
    }
    return resultRows;
  }

  @Query('testPSK')
  public async testPSK(obj: any, input: any, ctx: any): Promise<any> {
    const { day } = input;
    const dayData = await this.oracleGetData(moment(day).toDate());
    return dayData;
  }

  @Query('checkPSK')
  public async checkPSK(): Promise<boolean> {
    this.logger.log('Serving `checkPSK` query', CronMethodsResolver.name);
    const day = moment()
      .subtract(1, 'day')
      .startOf('day');

    const dayData = await this.oracleGetData(day.toDate());
    this.logger.debug({
      method: 'checkPSK',
      dayData,
    });

    const energyCompanyInfo = {
      name: 'Питербургская сбытовая компания',
      inn: '123456',
    };
    const consumerInfo = {
      name: 'Потребитель 1',
    };
    let EC = await this.energyCompanyService.findByName(energyCompanyInfo.name);
    if (!EC) {
      const newEC = new EnergyCompany();
      newEC.name = energyCompanyInfo.name;
      newEC.inn = energyCompanyInfo.inn;
      EC = await this.energyCompanyService.save(newEC);
    }

    let consumer = await this.consumersService.findByNameAndEC(consumerInfo.name, EC);
    if (!consumer) {
      const newConsumer = new Consumer();
      newConsumer.name = consumerInfo.name;
      newConsumer.energyCompany = EC;
      consumer = await this.consumersService.save(newConsumer);
    }

    for (const reading of dayData) {
      const timestamp = moment(day)
        .add(reading[11], 'minutes')
        .toDate();
      this.logger.debug({
        timestamp,
      });
      // reading[3]
      const meterName = reading[3].toString();
      let meter = await this.metersService.getByNameAndConsumer(meterName, consumer);
      if (!meter) {
        const newMeter = new Meter();
        newMeter.name = meterName;
        newMeter.consumer = consumer;
        meter = await this.metersService.save(newMeter);
      }
      // 1 – А+

      // 2 – А-

      // 3 – R+

      // 4 – R-
      const foundReading = await this.readingsService.findByTimestampAndMeter(timestamp, meter);
      if (!foundReading) {
        const newReading = new Reading();
        if (reading[2] === 1) {
          newReading.activePower = parseFloat(reading[8].toString());
        } else if (reading[2] === 3) {
          newReading.reactivePower = parseFloat(reading[8].toString());
        } else {
          continue;
        }
        newReading.meter = meter;
        newReading.timestamp = timestamp;
        await this.readingsService.save(newReading);
        this.logger.debug('saved readings');
      } else {
        let typePower: 'activePower' | 'reactivePower' = 'activePower';
        if (reading[2] === 1) {
          typePower = 'activePower';
        } else if (reading[2] === 3) {
          typePower = 'reactivePower';
        } else {
          continue;
        }
        if (foundReading[typePower] === null) {
          foundReading[typePower] = parseFloat(reading[8].toString());
          await this.readingsService.save(foundReading);
          this.logger.debug('saved readings');
        } else {
          continue;
        }
      }
    }
    return true;
  }
}
