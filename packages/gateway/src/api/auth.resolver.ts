import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { AuthService } from "../auth/auth.service";
import { User } from "../storage/user.entity";
import { CurrentUser } from "../auth/current-user.decorator";
import { LocalStrategy } from "../auth/local.strategy";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly localStrategy: LocalStrategy
  ) {}

  @Mutation("auth")
  public async auth(
    @Args("login") login: string,
    @Args("password") password: string
  ): Promise<any> {
    return this.localStrategy.validate(login, password);
  }

  @Mutation("checkAuth")
  @UseGuards(GqlAuthGuard)
  public async checkAuth(@CurrentUser() user: User): Promise<any> {
    return {
      id: user.id,
      login: user.login,
      token: user.token
    };
  }
}
