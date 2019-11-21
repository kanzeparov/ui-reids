import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import * as path from "path";
import { ApiModule } from "./api/api.module";
import { CommonModule } from "./common/common.module";
import { ConfigModule } from "./config/config.module";
import { StorageModule } from "./storage/storage.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule,
    CommonModule,
    ApiModule,
    StorageModule,
    AuthModule,
    GraphQLModule.forRoot({
      introspection: true,
      typePaths: [path.resolve(__dirname, "../schema.graphql")],
      debug: true,
      path: "/api/graphql",
      playground: true,
      installSubscriptionHandlers: true,
      include: [ApiModule],
      context: ({ req }) => ({ req })
    })
  ]
})
export class AppModule {}
