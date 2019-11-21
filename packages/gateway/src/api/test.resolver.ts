import { Query, Resolver } from "@nestjs/graphql";
import { LoggerService } from "../common/logger.service";
import { ReportsService } from "../reports/reports.service";
import { ConsumersService } from "../storage/consumers.service";
import { RelUsersEcService } from "../storage/relUsersEc.service";
import { UsersService } from "../storage/users.service";
import { XmlImportService } from "../xmlImport/xmlImport.service";
import { EmailParseService } from "../xmlImport/emailParse.service";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { User } from "../storage/user.entity";
import { CurrentUser } from "../auth/current-user.decorator";

@Resolver()
export class TestResolver {
  constructor(
    private readonly logger: LoggerService,
    private readonly emailParseService: EmailParseService,
    private readonly usersService: UsersService,
    private readonly consumersService: ConsumersService,
    private readonly xmlImportService: XmlImportService,
    private readonly reportsService: ReportsService,
    private readonly relUsersEcService: RelUsersEcService
  ) {}

  @Query("xmlImport")
  public async xmlImport(): Promise<boolean> {
    await this.emailParseService.startParsing();
    await this.xmlImportService.importLastFile();
    return true;
  }

  @Query("generateReport")
  @UseGuards(GqlAuthGuard)
  public async generateReport(
    @CurrentUser() user: User
  ): Promise<string | null> {
    const list = await this.relUsersEcService.getAllEnergyCompaniesByUser(user);
    const companies = list.map(item => item.energyCompany);
    return this.reportsService.generate(companies);
  }
}
