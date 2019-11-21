import { createLogger, format, transports } from "winston";
import { pick } from "ramda";

// @ts-ignore
const formatError = pick(["message", "stack"]);

const enumerateErrorFormat = format(info => {
  if (info instanceof Error) {
    return Object.assign({}, info, formatError(info));
  }
  return info;
});

const formats = {
  console: [
    enumerateErrorFormat(),
    format.timestamp({
      format: process.env.LOG_TIME_FORMAT
    }),
    format.colorize(),
    format.printf(info => {
      const stack = info.stack ? `\nStack: ${info.stack}` : "";
      const method = info.method && info.method.length ? `/${info.method}` : "";
      return `${info.timestamp} ${info.level} [${info.module}${method}] ${info.message}${stack}`;
    })
  ],
  json: [
    enumerateErrorFormat(),
    format.timestamp({ format: process.env.LOG_TIME_FORMAT }),
    format.json()
  ]
};

class CustomLogger {
  static logger = createLogger({
    level: process.env.LOG_LEVEL,
    // @ts-ignore
    format: format.combine(...formats[process.env.LOG_FORMAT]),
    transports: [
      // - Write to all logs with level `info` and above to `combined.log`
      // new transports.File({ filename: 'combined.log' }),
      // - Write all logs error (and above) to Console/terminal
      new transports.Console()
    ]
  });
}

export default (moduleName: String) => {
  const options = {
    module: moduleName
  };
  return {
    info: (msg: string) => CustomLogger.logger.info(msg, options),
    debug: (msg: string) => CustomLogger.logger.debug(msg, options),
    error: (msg: string) => CustomLogger.logger.error(msg, options),
    debugJSON: (label: String, msg: Object) =>
      CustomLogger.logger.debug(
        `[${label}] ${JSON.stringify(msg, null, 2)}`,
        options
      )
  };
};
