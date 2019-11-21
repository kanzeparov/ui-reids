import { Args, Query, Resolver } from "@nestjs/graphql";
import { LoggerService } from "../common/logger.service";
import { ConsumersService } from "../storage/consumers.service";
import { RelUsersEcService } from "../storage/relUsersEc.service";
import { UsersService } from "../storage/users.service";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { User } from "../storage/user.entity";

@Resolver()
export class ConsumersResolver {
  constructor(
    private readonly logger: LoggerService,
    private readonly usersService: UsersService,
    private readonly consumersService: ConsumersService,
    private readonly relUsersEcService: RelUsersEcService
  ) {}

  @Query("consumersGetList")
  @UseGuards(GqlAuthGuard)
  public async consumersGetList(
    @Args("energyCompanyId") energyCompanyId: number,
    @CurrentUser() user: User
  ): Promise<any> {
    const list = await this.relUsersEcService.getAllEnergyCompaniesByUser(user);
    const companies = await list.map(item => item.energyCompany);
    let idsCompanies: number[] = [];
    idsCompanies = companies.map(c => c.id);
    if (energyCompanyId) {
      const foundECById = companies.find(c => c.id === energyCompanyId);
      if (!foundECById) {
        throw new Error(
          `energy company (id = ${energyCompanyId}) unavailable to this user`
        );
      }
      idsCompanies = [energyCompanyId];
    }
    return this.consumersService.getByEnergyCompanyIds(idsCompanies);
  }
}
