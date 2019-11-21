import * as Joi from "@hapi/joi";
import { URL } from "url";

const DEFAULT_INFURA_URL = "https://rinkeby.infura.io/v3";

export interface IEnvConfig {
  [key: string]: string | undefined;
}

function validateEnv(envConfig: IEnvConfig): IEnvConfig {
  const envVarsSchema: Joi.ObjectSchema = Joi.object({
    NODE_ENV: Joi.string()
      .valid(["development", "production", "test", "staging"])
      .default("development"),
    PORT: Joi.number().default(9001),
    HOST: Joi.string().default("0.0.0.0"),
    LOG_LEVEL: Joi.string()
      .valid(["debug", "info", "warn", "error"])
      .default("debug"),
    LOG_FORMAT: Joi.string(),
    PG: Joi.string(),
    // PG: Joi.string().uri({ scheme: "postgresql" }),
    SOCKET_TOKEN: Joi.string(),
    MNEMONIC: Joi.string(),
    INFURA_URL: Joi.string()
      .uri({ scheme: ["ws", "http", "https"] })
      .default(DEFAULT_INFURA_URL),
    NOTARIZATION_MODULE_URL: Joi.string(),
    MAIL_USER: Joi.string(),
    MAIL_PASSWORD: Joi.string(),
    MAIL_HOST: Joi.string()
  });

  const { error, value: validatedEnvConfig } = Joi.validate(
    envConfig,
    envVarsSchema,
    {
      allowUnknown: true
    }
  );
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
  return validatedEnvConfig;
}

export interface IDatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  NOTARIZATION_MODULE_URL: string;
  MAIL_USER: string;
  MAIL_PASSWORD: string;
  MAIL_HOST: string;
}

export class ConfigService {
  private readonly envConfig: IEnvConfig;
  private readonly databaseUrl: URL;

  constructor() {
    this.envConfig = validateEnv(process.env);
    this.databaseUrl = new URL(String(this.envConfig.PG));
  }

  get host(): string {
    return String(this.envConfig.HOST);
  }

  get port(): number {
    return Number(this.envConfig.PORT);
  }

  get mnemonic(): string {
    return String(this.envConfig.MNEMONIC);
  }

  get infuraUrl(): string {
    return String(this.envConfig.INFURA_URL);
  }

  get logLevel(): string {
    return String(this.envConfig.LOG_LEVEL);
  }

  get socketToken(): string {
    return String(this.envConfig.SOCKET_TOKEN);
  }

  get NOTARIZATION_MODULE_URL(): string {
    return String(this.envConfig.NOTARIZATION_MODULE_URL);
  }

  get MAIL_USER(): string {
    return String(this.envConfig.MAIL_USER);
  }

  get MAIL_PASSWORD(): string {
    return String(this.envConfig.MAIL_PASSWORD);
  }

  get MAIL_HOST(): string {
    return String(this.envConfig.MAIL_HOST);
  }

  get database(): IDatabaseConfig {
    return {
      host: this.databaseUrl.hostname,
      port: Number(this.databaseUrl.port),
      username: unescape(this.databaseUrl.username),
      password: this.databaseUrl.password,
      name: this.databaseUrl.pathname.replace("/", ""),
      NOTARIZATION_MODULE_URL: this.NOTARIZATION_MODULE_URL,
      MAIL_USER: this.MAIL_USER,
      MAIL_PASSWORD: this.MAIL_PASSWORD,
      MAIL_HOST: this.MAIL_HOST
    };
    // return {
    //   host: "mppserverpg.postgres.database.azure.com",
    //   port: 5432,
    //   username: "ruensb@mppserverpg",
    //   password: "9a07sf90DSFs0f9mLV",
    //   name: "/ondermpp".replace("/", ""),
    // };
  }
}
