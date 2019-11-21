import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user.entity";

@Entity("energy_company")
export class EnergyCompany {
  @PrimaryGeneratedColumn()
  // @ts-ignore
  public id: number;

  @Column()
  // @ts-ignore
  public name: string;

  @Column()
  // @ts-ignore
  public address: string;

  @Column()
  // @ts-ignore
  public inn: string;
}
