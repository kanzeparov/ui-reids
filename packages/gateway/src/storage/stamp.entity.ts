import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Meter } from "./meter.entity";

@Entity("stamps")
export class Stamp {
  @PrimaryGeneratedColumn()
  // @ts-ignore
  public id: number;

  @ManyToOne(() => Meter, meter => meter.stamps)
  // @ts-ignore
  public meter: Meter;

  @Column()
  // @ts-ignore
  public day: Date;

  @Column()
  // @ts-ignore
  public dataHash: string;

  @Column()
  // @ts-ignore
  public notarized: boolean;

  @Column()
  // @ts-ignore
  public ethereumTxid: string;

  @Column()
  // @ts-ignore
  public timestamp: Date;

  @Column()
  // @ts-ignore
  public lastCheckTimestamp: Date;
}
