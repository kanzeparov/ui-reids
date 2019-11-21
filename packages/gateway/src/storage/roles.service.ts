import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "./role.entity";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ) {}

  public async save(role: Role): Promise<Role> {
    return this.roleRepository.save(role);
  }
}
