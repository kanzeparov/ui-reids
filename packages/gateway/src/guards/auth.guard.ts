import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Req,
  Request,
  CanActivate
} from "@nestjs/common";
import _ from "lodash";
import { GqlExecutionContext, CONTEXT } from "@nestjs/graphql";
import { LoggerService } from "../common/logger.service";
import { UsersService } from "../storage/users.service";

@Injectable()
export class GraphqlGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private readonly logger: LoggerService
  ) {}
  public async canActivate(context: GqlExecutionContext): Promise<boolean> {
    // const { headers } = _.find(context.getArgs(), "headers");
    // if (!headers.authorization) {
    //   throw new UnauthorizedException();
    // }
    // const user = await this.usersService.findOne({
    //   token: headers.authorization,
    // });
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // const request = context.switchToHttp().getRequest();
    // const user = request.user;
    // // return user;

    // const request = context.switchToHttp().getRequest();
    // const user = request.user;
    this.logger.debug({
      type: "guard"
    });
    return true;
  }
}
