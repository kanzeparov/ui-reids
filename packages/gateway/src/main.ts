import "dotenv/config";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  const host = app.get(ConfigService).host;
  const port = app.get(ConfigService).port;
  await app.listen(port, host);
}

bootstrap();
