import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import crypto from "crypto";
import { Repository } from "typeorm";
import { User } from "./user.entity";

const TOKEN_LENGTH = 25;
const SECRET = "mpp";

export function randomToken(): string {
  return crypto.randomBytes(TOKEN_LENGTH).toString("hex");
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  public async refreshToken(user: User): Promise<void> {
    user.token = randomToken();
    await this.userRepository.save(user);
  }

  public passwordHash(password: string): string {
    return crypto
      .createHmac("sha256", SECRET)
      .update(password)
      .digest("hex");
  }

  public async findByToken(token: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      token
    });
  }

  public async findByCredentials(
    login: string,
    password: string
  ): Promise<User | undefined> {
    const digest = this.passwordHash(password);
    return this.userRepository.findOne({
      login,
      password: digest
    });
  }

  public async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
