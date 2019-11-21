import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  // @ts-ignore
  public id: number;

  @Column()
  // @ts-ignore
  public login: string;

  @Column()
  // @ts-ignore
  public password: string;

  @Column()
  // @ts-ignore
  public token: string;

  @Column()
  // @ts-ignore
  public tz: string;

  @ManyToOne(() => Role, role => role.id)
  // @ts-ignore
  public role: Role;
}
