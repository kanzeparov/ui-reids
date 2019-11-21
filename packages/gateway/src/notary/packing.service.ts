import { Injectable } from "@nestjs/common";
import * as abi from "ethereumjs-abi";
import * as _ from "lodash";
import * as moment from "moment";
import { Meter } from "../storage/meter.entity";
import { Reading } from "../storage/reading.entity";

@Injectable()
export class PackingService {
  public digest(day: moment.Moment, meter: Meter, readings: Reading[]): Buffer {
    const pack = {
      date: day.startOf("day").toISOString(),
      meter: meter.name,
      consumer: meter.consumer.name,
      readings: readings.map(r => {
        return {
          timestamp: r.timestamp.toISOString(),
          activePower: _.round(r.activePower, 2),
          reactivePower: _.round(r.reactivePower, 2)
        };
      })
    };
    const serialized = JSON.stringify(pack);
    return abi.soliditySHA3(["string"], [serialized]);
  }
}
