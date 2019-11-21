import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Consumer } from "./consumer.entity";
import { Meter } from "./meter.entity";

@Injectable()
export class MetersService {
  constructor(
    @InjectRepository(Meter)
    private readonly metersRepository: Repository<Meter>
  ) {}

  public async save(meter: Meter): Promise<Meter> {
    return this.metersRepository.save(meter);
  }

  public async all(): Promise<Meter[]> {
    return this.metersRepository.find({
      relations: ["consumer"]
    });
  }

  public async getByConsumersList(consumerListIds: number[]): Promise<Meter[]> {
    return this.metersRepository.find({
      consumer: In(consumerListIds)
    });
  }

  public async getByNameAndConsumer(
    name: string,
    consumer: Consumer
  ): Promise<Meter | undefined> {
    return this.metersRepository.findOne({
      name,
      consumer
    });
  }
}
