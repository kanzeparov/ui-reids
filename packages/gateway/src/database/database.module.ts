import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseProviders } from "./database.providers";

@Module({
  imports: [...databaseProviders],
  exports: [TypeOrmModule]
})
export class DatabaseModule {}
