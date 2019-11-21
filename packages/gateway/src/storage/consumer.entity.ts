import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { EnergyCompany } from "./energy_company.entity";
import { Meter } from "./meter.entity";

@Entity("consumers")
export class Consumer {
  @PrimaryGeneratedColumn()
  // @ts-ignore
  public id: number;

  @Column()
  // @ts-ignore
  public name: string;

  @ManyToOne(() => EnergyCompany, energyCompany => energyCompany.id)
  // @ts-ignore
  public energyCompany: EnergyCompany;

  @OneToMany(type => Meter, meter => meter.consumer)
  // @ts-ignore
  public meters: Meter[];
}
