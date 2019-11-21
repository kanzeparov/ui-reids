import { Strategy } from "passport-http-bearer";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "../storage/user.entity";
import { LoggerService } from "../common/logger.service";

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService
  ) {
    super();
  }

  async validate(token: string): Promise<User | undefined> {
    this.logger.debug(
      `Authenticating user: token=${token}`,
      BearerStrategy.name
    );
    const user = await this.authService.byToken(token);
    if (user) {
      this.logger.debug(
        `Found user: id=${user.id}, username=${user.login}`,
        BearerStrategy.name
      );
    } else {
      this.logger.debug(`No user found`, BearerStrategy.name);
    }
    return user;
  }
}
