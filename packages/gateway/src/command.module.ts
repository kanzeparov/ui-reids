import { Module } from "@nestjs/common";
import * as yargs from "yargs";
import { ConfigModule } from "./config/config.module";
import { SeedService } from "./storage/seed.service";
import { StorageModule } from "./storage/storage.module";

@Module({
  imports: [ConfigModule, StorageModule],
  providers: [SeedService]
})
export class CommandModule {
  constructor(private readonly seedService: SeedService) {}

  public async run(argv: string[]) {
    const commandNameIndex = argv.indexOf(yargs.parse().$0);
    const properArgs = argv.slice(commandNameIndex);
    yargs
      .command({
        command: "seed",
        describe: "seed the database",
        handler: () => {
          return this.seed();
        }
      })
      .parse(properArgs);
  }

  public async seed() {
    await this.seedService.initUsers();
    await this.seedService.interStart();
  }
}
