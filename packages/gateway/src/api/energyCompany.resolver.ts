import { Query, Resolver } from "@nestjs/graphql";
import { LoggerService } from "../common/logger.service";
import { ConsumersService } from "../storage/consumers.service";
import { EnergyCompany } from "../storage/energy_company.entity";
import { EnergyCompanyService } from "../storage/energy_company.service";
import { RelUsersEcService } from "../storage/relUsersEc.service";
import { UsersService } from "../storage/users.service";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { User } from "../storage/user.entity";

@Resolver()
export class EnergyCompanyResolver {
  constructor(
    private readonly logger: LoggerService,
    private readonly usersService: UsersService,
    private readonly consumersService: ConsumersService,
    private readonly energyCompanyService: EnergyCompanyService,
    private readonly relUsersEcService: RelUsersEcService
  ) {}

  @Query("enegrgyCompanyGetList")
  @UseGuards(GqlAuthGuard)
  public async consumersGetList(
    @CurrentUser() user: User
  ): Promise<EnergyCompany[]> {
    const list = await this.relUsersEcService.getAllEnergyCompaniesByUser(user);
    return list.map(item => item.energyCompany);
  }
}
