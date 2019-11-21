import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Meter } from "./meter.entity";

@Entity("readings")
export class Reading {
  @PrimaryGeneratedColumn()
  // @ts-ignore
  public id: number;

  @Column()
  // @ts-ignore
  public timestamp: Date;

  @Column()
  // @ts-ignore
  public activePower: number;

  @Column()
  // @ts-ignore
  public reactivePower: number;

  @ManyToOne(() => Meter, meter => meter.id)
  // @ts-ignore
  public meter: Meter;
}
