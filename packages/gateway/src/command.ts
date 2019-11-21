import { NestFactory } from "@nestjs/core";
import { CommandModule } from "./command.module";

async function command() {
  const context = await NestFactory.createApplicationContext(CommandModule);
  const commandModule = context.get(CommandModule);
  await commandModule.run(process.argv);
}

command();
