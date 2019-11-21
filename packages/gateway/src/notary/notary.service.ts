import { Injectable } from "@nestjs/common";
import * as util from "ethereumjs-util";
import moment from "moment";
import { LoggerService } from "../common/logger.service";
import { Meter } from "../storage/meter.entity";
import { MetersService } from "../storage/meters.service";
import { ReadingsService } from "../storage/readings.service";
import { Stamp } from "../storage/stamp.entity";
import { StampsService } from "../storage/stamps.service";
import { EthereumService } from "./ethereum.service";
import { PackingService } from "./packing.service";

@Injectable()
export class NotaryService {
  constructor(
    private readonly logger: LoggerService,
    private readonly readingsService: ReadingsService,
    private readonly metersService: MetersService,
    private readonly ethereumService: EthereumService,
    private readonly stampsService: StampsService,
    private readonly packingService: PackingService
  ) {}

  public async checkNotarization(stampId: number) {
    const stamp = await this.stampsService.findById(stampId);
    if (stamp) {
      const startOfDay = moment(stamp.day).utc();
      const endOfDay = moment(startOfDay)
        .utc()
        .endOf("day");
      const meter = stamp.meter;
      const readings = await this.readingsService.byWindowPerMeter(
        startOfDay.toDate(),
        endOfDay.toDate(),
        meter
      );
      const digest = this.packingService.digest(startOfDay, meter, readings);
      return {
        stamp,
        readingsCount: readings.length,
        digest: {
          expected: util.bufferToHex(digest),
          stamped: stamp.dataHash,
          equals: util.bufferToHex(digest) === stamp.dataHash
        }
      };
    } else {
      throw new Error("Not found");
    }
  }

  public async notarizeAll(): Promise<Stamp[]> {
    this.logger.log("Notarizing all meters", NotaryService.name);
    const meters = await this.metersService.all();
    // return Promise.all(meters.map(async (meter) => {
    //   return this.notarizeMeter(meter);
    // }));
    return [await this.notarizeMeter(meters[0])];
  }

  public async notarizeMeter(meter: Meter): Promise<Stamp> {
    const startOfDay = moment()
      .utc()
      .startOf("day");
    const endOfDay = moment()
      .utc()
      .endOf("day");
    const startString = startOfDay.toISOString();

    const endString = endOfDay.toISOString();
    const logMessage = `Notarizing meter ${meter.name}: id=${meter.id}, start=${startString}, end=${endString}`;
    this.logger.log(logMessage, NotaryService.name);

    const readings = await this.readingsService.byWindowPerMeter(
      startOfDay.toDate(),
      endOfDay.toDate(),
      meter
    );
    const digest = this.packingService.digest(startOfDay, meter, readings);
    const txid = await this.ethereumService.addNotarization(digest, startOfDay);
    this.logger.log(
      `Got notarization: meter=${
        meter.name
      }, day=${startOfDay.toISOString()}, txid=${txid}`,
      NotaryService.name
    );
    const stamp = await this.addStamp(meter, startOfDay, digest, txid);
    console.log(`STAMP ID ${stamp.id}, readingss=${readings.length}`);
    return stamp;
  }

  private async addStamp(
    meter: Meter,
    day: moment.Moment,
    digest: Buffer,
    txid: string
  ): Promise<Stamp> {
    const stamp = new Stamp();
    stamp.dataHash = util.bufferToHex(digest);
    stamp.day = day.toDate();
    stamp.ethereumTxid = txid;
    stamp.meter = meter;
    stamp.timestamp = moment().toDate();
    this.logger.log(
      `Saving stamp: meter=${
        meter.name
      }, day=${day.toISOString()}, txid=${txid}`,
      NotaryService.name
    );
    return this.stampsService.save(stamp);
  }
}
