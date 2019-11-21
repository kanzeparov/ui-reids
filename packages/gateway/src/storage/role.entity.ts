import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  // @ts-ignore
  public id: number;

  @Column()
  // @ts-ignore
  public name: string;
}
