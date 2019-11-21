import { Query, Resolver } from "@nestjs/graphql";
import { LoggerService } from "../common/logger.service";
import { SeedService } from "../storage/seed.service";

@Resolver()
export class InitResolver {
  constructor(
    private readonly seedService: SeedService,
    private readonly logger: LoggerService
  ) {}

  @Query("initDB")
  public async seed(): Promise<boolean> {
    this.logger.log("Serving `initDB` query", InitResolver.name);
    return this.seedService.interStart();
    // return this.seedService.initUsers();
  }
}
