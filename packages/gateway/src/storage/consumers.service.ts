import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Consumer } from "./consumer.entity";
import { EnergyCompany } from "./energy_company.entity";
import { Meter } from "./meter.entity";

@Injectable()
export class ConsumersService {
  constructor(
    @InjectRepository(Consumer)
    private readonly consumerRepository: Repository<Consumer>
  ) {}

  public async save(consumer: Consumer): Promise<Consumer> {
    return this.consumerRepository.save(consumer);
  }

  public find(where: {
    id?: number;
    meters?: [Meter];
    name?: string;
    energyCompany?: EnergyCompany;
  }): Promise<Consumer[]> {
    return this.consumerRepository.find(where);
  }

  public async findByName(name: string): Promise<Consumer | undefined> {
    return this.consumerRepository.findOne({
      name
    });
  }

  public async findByNameAndEC(
    name: string,
    energyCompany: EnergyCompany
  ): Promise<Consumer | undefined> {
    return this.consumerRepository.findOne({
      name,
      energyCompany
    });
  }

  public async getByEnergyCompanyIds(
    energyCompanyIds: number[]
  ): Promise<Consumer[]> {
    return this.consumerRepository.find({
      energyCompany: In(energyCompanyIds)
    });
  }
}
