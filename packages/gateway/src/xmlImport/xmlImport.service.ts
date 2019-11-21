import { Injectable } from "@nestjs/common";
import fs from "fs";
import iconv from "iconv-lite";
import moment from "moment";
import convert from "xml-js";
import { LoggerService } from "../common/logger.service";
import { Consumer } from "../storage/consumer.entity";
import { ConsumersService } from "../storage/consumers.service";
import { EnergyCompany } from "../storage/energy_company.entity";
import { EnergyCompanyService } from "../storage/energy_company.service";
import { Meter } from "../storage/meter.entity";
import { MetersService } from "../storage/meters.service";
import { Reading } from "../storage/reading.entity";
import { ReadingsService } from "../storage/readings.service";

@Injectable()
export class XmlImportService {
  constructor(
    private readonly logger: LoggerService,
    private readonly energyCompanyService: EnergyCompanyService,
    private readonly consumersService: ConsumersService,
    private readonly metersService: MetersService,
    private readonly readingsService: ReadingsService
  ) {}

  public async importLastFile(): Promise<any> {
    this.logger.log("importLastFile start");
    const files = fs.readdirSync("./xml/");
    const listXml: string[] = [];
    files.forEach(fileName => {
      if (/\.xml$/gi.test(fileName)) {
        listXml.push(fileName);
      }
    });
    for (const fname of listXml) {
      try {
        this.logger.debug(`import ${fname} start`);
        await this.importOneFile(fname);
        this.logger.debug(`import ${fname} end`);
      } catch (error) {
        this.logger.error(`import ${fname} error`);
      }
    }
    // await this.importOneFile('80020_7736520080_20190705_252_.xml');
    this.logger.log("importLastFile end");
  }

  private async importOneFile(fname: string): Promise<any> {
    const xml = require("fs").readFileSync(`./xml/${fname}`, {
      encoding: "binary"
    });
    const convXML = iconv.decode(xml, "win1251");
    const options = {
      ignoreComment: true,
      alwaysChildren: true,
      compact: true
    };
    const result = convert.xml2js(convXML, options); // or convert.xml2json(xml, options)
    // fs.writeFileSync('./xml.json', JSON.stringify(result, null, 2));
    // @ts-ignore
    const message = result.message;
    const sender = message.sender;
    let ecExist = await this.energyCompanyService.findByName(sender.name._text);
    if (!ecExist) {
      const ecNew = new EnergyCompany();
      ecNew.name = sender.name._text;
      ecNew.inn = sender.inn._text;
      ecExist = await this.energyCompanyService.save(ecNew);
    }
    let typeXML = 0;
    if (sender.inn._text === "7736520080") {
      typeXML = 1;
    }
    if (sender.inn._text === "2224103849") {
      typeXML = 2;
    }
    const area = message.area;
    let consumerName = "";
    if (typeXML === 1) {
      consumerName = area.name._text;
    }
    if (typeXML === 2) {
      consumerName = area.measuringpoint._attributes.name;
    }
    let consumerExist = await this.consumersService.findByNameAndEC(
      consumerName,
      ecExist
    );
    if (!consumerExist) {
      const consumerNew = new Consumer();
      consumerNew.energyCompany = ecExist;
      consumerNew.name = consumerName;
      consumerExist = await this.consumersService.save(consumerNew);
    }
    const day = moment(message.datetime.day._text);
    if (typeXML === 1) {
      const meters = area.measuringpoint;
      for (const meter of meters) {
        let meterExist = await this.metersService.getByNameAndConsumer(
          meter._attributes.name,
          consumerExist
        );
        if (!meterExist) {
          const newMeter = new Meter();
          newMeter.name = meter._attributes.name;
          newMeter.consumer = consumerExist;
          meterExist = await this.metersService.save(newMeter);
        }
        // measuringchannel
        let readings = [];
        if (Array.isArray(meter.measuringchannel)) {
          const found = meter.measuringchannel.find(
            (item: any) => item._attributes.code === "01"
          );
          if (!found) {
            continue;
          }
          readings = found.period;
        } else {
          readings = meter.measuringchannel.period;
        }

        for (const period of readings) {
          const timestamp = moment(day);
          const { start, end } = period._attributes;
          timestamp.set({
            hour: start.slice(0, 2),
            minute: start.slice(2, 4)
          });
          const readingExist = await this.readingsService.findByTimestampAndMeter(
            timestamp.toDate(),
            meterExist
          );
          if (readingExist) {
            this.logger.debug(
              `reading exist ${meter._attributes.name} ${readingExist.id}`
            );
            continue;
          }
          const newReading = new Reading();
          newReading.meter = meterExist;
          newReading.activePower = parseFloat(period.value._text);
          newReading.timestamp = timestamp.toDate();
          await this.readingsService.save(newReading);
        }
      }
      fs.unlinkSync(`./xml/${fname}`);
      return;
    }
    if (typeXML === 2) {
      const meters = area.measuringpoint.measuringchannel;
      for (const meter of meters) {
        if (meter._attributes.code !== "01") {
          continue;
        }
        const meterName = meter._attributes.desc;
        let meterExist = await this.metersService.getByNameAndConsumer(
          meterName,
          consumerExist
        );
        if (!meterExist) {
          const newMeter = new Meter();
          newMeter.name = meterName;
          newMeter.consumer = consumerExist;
          meterExist = await this.metersService.save(newMeter);
        }
        const readings = meter.period;
        for (const period of readings) {
          const timestamp = moment(day);
          const { start, end } = period._attributes;
          timestamp.set({
            hour: start.slice(0, 2),
            minute: start.slice(2, 4)
          });
          const readingExist = await this.readingsService.findByTimestampAndMeter(
            timestamp.toDate(),
            meterExist
          );
          if (readingExist) {
            continue;
          }
          const newReading = new Reading();
          newReading.meter = meterExist;
          newReading.activePower = parseFloat(period.value._text);
          newReading.timestamp = timestamp.toDate();
          await this.readingsService.save(newReading);
        }
      }
    }
    fs.unlinkSync(`./xml/${fname}`);
    return true;
  }
}
