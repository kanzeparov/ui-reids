import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../common/logger.service";
import { UsersService } from "../storage/users.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private usersService: UsersService,
    private readonly logger: LoggerService
  ) {}
  public async use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const user = await this.usersService.findByToken(token);
      if (user) {
        // @ts-ignore
        req.user = user;
      }
    }
    return next();
  }
}
