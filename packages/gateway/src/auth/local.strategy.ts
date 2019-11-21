import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoggerService } from "../common/logger.service";

export interface IAuthResponse {
  token: string;
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<IAuthResponse> {
    this.logger.debug(
      `Authenticating user: username=${username}`,
      LocalStrategy.name
    );
    const user = await this.authService.byCredentials(username, password);
    if (user) {
      this.logger.debug(`Found user: id=${user.id}`, LocalStrategy.name);
      return {
        token: user.token
      };
    } else {
      this.logger.debug(`No user found`, LocalStrategy.name);
      throw new UnauthorizedException();
    }
  }
}
