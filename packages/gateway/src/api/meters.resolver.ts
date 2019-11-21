import { Args, Query, Resolver } from "@nestjs/graphql";
import { LoggerService } from "../common/logger.service";
import { ConsumersService } from "../storage/consumers.service";
import { MetersService } from "../storage/meters.service";
import { RelUsersEcService } from "../storage/relUsersEc.service";
import { UsersService } from "../storage/users.service";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { User } from "../storage/user.entity";

@Resolver()
export class MetersResolver {
  constructor(
    private readonly logger: LoggerService,
    private readonly usersService: UsersService,
    private readonly consumersService: ConsumersService,
    private readonly metersService: MetersService,
    private readonly relUsersEcService: RelUsersEcService
  ) {}

  @Query("metersGetList")
  @UseGuards(GqlAuthGuard)
  public async metersGetList(
    @Args("consumerId") consumerId: number,
    @CurrentUser() user: User
  ): Promise<any> {
    const list = await this.relUsersEcService.getAllEnergyCompaniesByUser(user);
    const companies = await list.map(item => item.energyCompany);
    const consumersList = await this.consumersService.getByEnergyCompanyIds(
      companies.map(c => c.id)
    );

    let idsConsumers: number[] = [];
    idsConsumers = consumersList.map(c => c.id);
    if (consumerId) {
      const found = consumersList.find(c => c.id === consumerId);
      if (!found) {
        throw new Error(
          `consumer (id = ${consumerId}) unavailable to this user and selected energy company`
        );
      }
      idsConsumers = [consumerId];
    }

    return this.metersService.getByConsumersList(idsConsumers);
  }
}
