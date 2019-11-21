import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EnergyCompany } from "./energy_company.entity";
import { User } from "./user.entity";

@Entity("rel_users_ec")
export class RelUsersEc {
  @PrimaryGeneratedColumn()
  // @ts-ignore
  public id: number;

  @ManyToOne(() => User, user => user.id)
  // @ts-ignore
  public user: User;

  @ManyToOne(() => EnergyCompany, energyCompany => energyCompany.id)
  // @ts-ignore
  public energyCompany: EnergyCompany;
}
