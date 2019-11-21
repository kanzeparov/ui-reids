import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Meter } from './meter.entity';
import { Reading } from './reading.entity';
import { LoggerService } from '../common/logger.service';
import { IOrderField } from '../common/IOrderField';

@Injectable()
export class ReadingsService {
  constructor(
    @InjectRepository(Reading)
    private readonly readingsRepository: Repository<Reading>,
    private readonly logger: LoggerService,
  ) {}

  private prepareOrders(sort: IOrderField[]): IOrderField[] {
    const frontFields: any = {
      consumer: 'consumers.name',
      meterName: 'meters.name',
      meterId: 'meters.id',
      endPeriod: 'timestamp',
      powerActive: 'activePower',
      powerReactive: 'reactivePower',
    };
    const ordered = sort.map(item => {
      return {
        field: frontFields[item.field],
        order: item.order,
      };
    });
    return ordered;
  }

  public async save(reading: Reading): Promise<Reading> {
    return this.readingsRepository.save(reading);
  }

  public async byWindowPerMeter(from: Date, to: Date, meter: Meter): Promise<Reading[]> {
    return this.readingsRepository.find({
      where: [
        {
          meter,
          timestamp: Between(from, to),
        },
      ],
      order: {
        timestamp: 'DESC',
        meter: 'ASC',
      },
      relations: ['meter', 'meter.consumer'],
    });
  }

  public async byWindowPerMeterIds(from: Date, to: Date, meterIds: number[]): Promise<Reading[]> {
    return this.readingsRepository.find({
      where: [
        {
          meter: In(meterIds),
          timestamp: Between(from, to),
        },
      ],
      order: {
        timestamp: 'DESC',
        meter: 'ASC',
      },
      relations: ['meter', 'meter.consumer'],
    });
  }

  public async byWindowPerMeterIdsPaging(
    from: Date,
    to: Date,
    meterIds: number[],
    page: number,
    pageSize: number,
  ): Promise<{ readings: Reading[]; pagesCount: number }> {
    const skip = page === 1 ? 0 : (page - 1) * pageSize;
    const readings = await this.readingsRepository.find({
      where: [
        {
          meter: In(meterIds),
          timestamp: Between(from, to),
        },
      ],
      order: {
        timestamp: 'DESC',
        meter: 'ASC',
      },
      relations: ['meter', 'meter.consumer'],
      skip,
      take: pageSize,
    });
    const count = await this.readingsRepository.count({
      where: [
        {
          meter: In(meterIds),
          timestamp: Between(from, to),
        },
      ],
    });
    const pagesCount = Math.ceil(count / pageSize);
    return {
      readings,
      pagesCount,
    };
  }

  public async byWindow(from: Date, to: Date): Promise<Reading[]> {
    return this.readingsRepository.find({
      where: [
        {
          timestamp: Between(from, to),
        },
      ],
      order: {
        timestamp: 'DESC',
        meter: 'ASC',
      },
      relations: ['meter', 'meter.consumer'],
    });
  }

  public async findByTimestampAndMeter(timestamp: Date, meter: Meter): Promise<Reading | undefined> {
    return this.readingsRepository.findOne({
      timestamp,
      meter,
    });
  }

  public async getByMeterIds(meterIds: number[]): Promise<Reading[]> {
    return this.readingsRepository.find({
      where: [
        {
          meter: In(meterIds),
        },
      ],
      order: {
        meter: 'ASC',
        timestamp: 'DESC',
      },
      relations: ['meter', 'meter.consumer', 'meter.consumer.energyCompany'],
    });
  }

  public async getByMeterIdsPaging(input: {
    meterIds: number[];
    page?: number;
    pageSize?: number;
    sort?: IOrderField[];
    from?: Date;
    to?: Date;
  }): Promise<{ readings: Reading[]; pagesCount: number; countItems: number }> {
    const { meterIds, page, pageSize, sort, from, to } = input;
    this.logger.debug({
      input,
    });
    let order: IOrderField[] = [];
    if (!sort) {
      order = [
        {
          field: 'meters.name',
          order: 'ASC',
        },
        {
          field: 'timestamp',
          order: 'DESC',
        },
      ];
    } else {
      order = this.prepareOrders(sort);
    }
    const where: any = {
      meter: In(meterIds),
    };
    if (from && to) {
      where.timestamp = Between(from, to);
    }
    const count = await this.readingsRepository.count({
      where: [where],
    });
    let skip = 0;
    if (page && pageSize) {
      skip = page === 1 ? 0 : (page - 1) * pageSize;
    }
    const builder = this.readingsRepository
      .createQueryBuilder('readings')
      .leftJoinAndSelect('readings.meter', 'meters')
      .leftJoinAndSelect('meters.consumer', 'consumers')
      .leftJoinAndSelect('consumers.energyCompany', 'energyCompany')
      .where('"meterId" IN(:...ids)', { ids: meterIds });
    if (from && to) {
      builder.andWhere('"timestamp" >= :from', { from });
      builder.andWhere('"timestamp" <= :to', { to });
    }
    order.forEach(item => {
      builder.addOrderBy(item.field, item.order);
    });
    if (page && pageSize) {
      this.logger.debug({
        skip,
        pageSize,
      });
      builder.offset(skip).limit(pageSize);
    }
    const readings = await builder.getMany();
    this.logger.debug({
      readings,
    });
    let pagesCount = 1;
    if (page && pageSize) {
      pagesCount = Math.ceil(count / pageSize);
    }
    return {
      readings,
      pagesCount,
      countItems: count,
    };
  }
}
