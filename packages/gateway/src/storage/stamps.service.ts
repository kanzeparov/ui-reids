import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Stamp } from "./stamp.entity";

@Injectable()
export class StampsService {
  constructor(
    @InjectRepository(Stamp)
    private readonly stampsRepository: Repository<Stamp>
  ) {}

  public save(stamp: Stamp): Promise<Stamp> {
    return this.stampsRepository.save(stamp);
  }

  public async all(): Promise<Stamp[]> {
    return this.stampsRepository.find({
      relations: ["meter", "meter.consumer"]
    });
  }

  public getByMeterIds(meterIds: number[]): Promise<Stamp[]> {
    return this.stampsRepository.find({
      where: {
        meter: In(meterIds)
      },
      relations: ["meter", "meter.consumer"]
    });
  }

  public findById(id: number): Promise<Stamp | undefined> {
    return this.stampsRepository.findOne({
      where: {
        id
      },
      relations: ["meter", "meter.consumer"]
    });
  }
}
