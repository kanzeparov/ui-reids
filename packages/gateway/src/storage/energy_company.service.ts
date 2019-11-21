import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EnergyCompany } from "./energy_company.entity";

@Injectable()
export class EnergyCompanyService {
  constructor(
    @InjectRepository(EnergyCompany)
    private readonly energyCompanyRepository: Repository<EnergyCompany>
  ) {}

  public async save(energyCompany: EnergyCompany): Promise<EnergyCompany> {
    return this.energyCompanyRepository.save(energyCompany);
  }

  public async findByName(name: string): Promise<EnergyCompany | undefined> {
    return this.energyCompanyRepository.findOne({
      name
    });
  }

  // public find(where: {
  //   id?: number,
  //   meters?: [Meter],
  //   name?: string,
  //   user?: User,
  // }): Promise<Consumer[]> {
  //   return this.consumerRepository.find(where);
  // }
}
