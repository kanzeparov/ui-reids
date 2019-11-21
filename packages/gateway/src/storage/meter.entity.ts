import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Consumer } from "./consumer.entity";
import { Reading } from "./reading.entity";
import { Stamp } from "./stamp.entity";

@Entity("meters")
export class Meter {
  @PrimaryGeneratedColumn()
  // @ts-ignore
  public id: number;

  @Column()
  // @ts-ignore
  public meterAccount: string;

  @Column()
  // @ts-ignore
  public name: string;

  @Column()
  // @ts-ignore
  public address: string;

  @Column()
  // @ts-ignore
  public tz: string

  @ManyToOne(() => Consumer, consumer => consumer.meters)
  // @ts-ignore
  public consumer: Consumer;

  @OneToMany(() => Reading, reading => reading.meter)
  // @ts-ignore
  public readings: Reading[];

  @OneToMany(() => Stamp, stamp => stamp.meter)
  // @ts-ignore
  public stamps: Stamp[];
}
