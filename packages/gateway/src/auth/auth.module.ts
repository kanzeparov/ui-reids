import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { StorageModule } from "../storage/storage.module";
import { UsersService } from "../storage/users.service";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { SessionController } from "./session.controller";
import { BearerStrategy } from "./bearer.strategy";

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: "bearer"
    }),
    StorageModule
  ],
  providers: [AuthService, UsersService, LocalStrategy, BearerStrategy],
  controllers: [SessionController],
  exports: [AuthService, LocalStrategy]
})
export class AuthModule {}
