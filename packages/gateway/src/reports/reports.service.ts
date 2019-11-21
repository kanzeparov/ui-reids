import { Injectable } from "@nestjs/common";
import fs from "fs";
import path from "path";
import moment from "moment";
import xlsx from "node-xlsx";
import osenv from "osenv";
import { LoggerService } from "../common/logger.service";
import { ConsumersService } from "../storage/consumers.service";
import { EnergyCompany } from "../storage/energy_company.entity";
import { MetersService } from "../storage/meters.service";
import { ReadingsService } from "../storage/readings.service";

@Injectable()
export class ReportsService {
  private readonly reportsDir: string;

  constructor(
    private readonly logger: LoggerService,
    private readonly readingsService: ReadingsService,
    private readonly metersService: MetersService,
    private readonly consumersService: ConsumersService
  ) {
    const tmpdir = osenv.tmpdir();
    this.reportsDir = path.resolve(tmpdir, `mpp`);
  }

  public async generate(ec: EnergyCompany[]): Promise<string | null> {
    const consumersList = await this.consumersService.getByEnergyCompanyIds(
      ec.map(e => e.id)
    );
    const metersList = await this.metersService.getByConsumersList(
      consumersList.map(c => c.id)
    );
    const readings = await this.readingsService.getByMeterIds(
      metersList.map(m => m.id)
    );
    if (!readings) {
      return null;
    }
    const dataXLSX: any[] = [
      [
        "meterId",
        "meterName",
        "address",
        "day",
        "start",
        "end",
        "activePower",
        "reactivePower",
        "consumer",
        "energyCompany"
      ]
    ];
    readings.forEach((row, i) => {
      const minutes = moment(row.timestamp)
        .utcOffset(0)
        .get("minutes");
      const hours = moment(row.timestamp)
        .utcOffset(0)
        .get("hours");
      const period = {
        start: "",
        end: ""
      };
      let hoursStr = "0";
      if (hours === 0) {
        hoursStr = "";
      } else {
        hoursStr = `${hours}`;
      }
      if (minutes < 30) {
        period.start = `${hoursStr}00`;
        period.end = `${hoursStr}30`;
      } else {
        period.start = `${hoursStr}30`;
        period.end = `${hours < 23 ? hours + 1 : 0}00`;
      }
      dataXLSX.push([
        row.meter.id,
        row.meter.name,
        row.meter.address,
        row.timestamp,
        period.start,
        period.end,
        row.activePower,
        row.reactivePower,
        row.meter.consumer.name,
        row.meter.consumer.energyCompany.name
      ]);
    });
    const buffer = xlsx.build([{ name: "list", data: dataXLSX }]);
    const filename = `${moment()
      .unix()
      .toString()}.xlsx`;
    await this.writeReport(buffer, filename);
    return filename;
  }

  private async ensureDirectoryExists(): Promise<void> {
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir);
    }
  }

  public async readReport(name: string): Promise<fs.ReadStream> {
    const filepath = path.resolve(this.reportsDir, name);
    await this.ensureFileExists(filepath);
    return fs.createReadStream(filepath);
  }

  private async ensureFileExists(filepath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.exists(filepath, exists => {
        if (exists) {
          resolve();
        } else {
          this.logger.error(`Can not find file ${filepath}`);
          reject(new Error(`Can not find file ${filepath}`));
        }
      });
    });
  }

  private async writeReport(raw: ArrayBuffer, name: string): Promise<void> {
    await this.ensureDirectoryExists();
    const filepath = path.resolve(this.reportsDir, name);
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(filepath, raw, err => {
        if (err) {
          this.logger.error(err);
          reject(err);
        } else {
          this.logger.log(`Written report to ${filepath}`);
          resolve();
        }
      });
    });
  }
}
