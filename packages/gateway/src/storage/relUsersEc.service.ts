import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RelUsersEc } from "./relUsersEc.entity";
import { User } from "./user.entity";

@Injectable()
export class RelUsersEcService {
  constructor(
    @InjectRepository(RelUsersEc)
    private readonly relUsersEcRepository: Repository<RelUsersEc>
  ) {}

  public async save(relUsersEc: RelUsersEc): Promise<RelUsersEc> {
    return this.relUsersEcRepository.save(relUsersEc);
  }

  public async getAllEnergyCompaniesByUser(user: User): Promise<RelUsersEc[]> {
    return await this.relUsersEcRepository.find({
      relations: ["energyCompany"],
      where: {
        user
      }
    });
    // return this.energyCompanyRepository.findByIds(found.map((i) => i.energyCompany.id));
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
