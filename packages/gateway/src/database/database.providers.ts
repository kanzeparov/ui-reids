import { TypeOrmModule } from "@nestjs/typeorm";
import * as path from "path";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      return {
        type: "postgres" as "postgres",
        host: configService.database.host,
        port: configService.database.port,
        username: configService.database.username,
        password: configService.database.password,
        database: configService.database.name,
        migrationsRun: true,
        migrations: [__dirname + "/migrations/*{.ts,.js}"],
        entities: [`${path.join(__dirname, "..")}/**/*.entity.{ts,js}`],
        logging: false
      };
    },
    inject: [ConfigService]
  })
];
