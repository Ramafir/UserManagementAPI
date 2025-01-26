/* eslint-disable @typescript-eslint/no-explicit-any */

import "winston-daily-rotate-file";
import { Logger, addColors, createLogger, format, transports } from "winston";

import { APP } from "@config";

import { Dependency } from "@enums/Dependency";

const { IS_PRODUCTION, IS_TEST } = APP;

const ERRORS_TRANSPORT = new transports.DailyRotateFile({
  level: "error",
  filename: "logs/errors/%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "7d",
});

export class Warden {
  private _debugLogger: Logger;
  private _errorsLogger: Logger;

  private constructor() {}

  public static start() {
    const warden = new Warden();

    warden._init();

    global.log = warden;
  }

  private _init() {
    if (this._debugLogger || this._errorsLogger) {
      throw Error("Warden is already initialized!");
    }

    addColors({
      info: "blue",
      warn: "yellow",
      error: "red",
      debug: "green",
    });

    this._errorsLogger = createLogger({
      silent: IS_TEST,
      level: "info",
      format: format.combine(format.splat(), format.json()),
      exceptionHandlers: [
        new transports.File({ filename: "logs/exceptions.log" }),
      ],
      transports: [ERRORS_TRANSPORT],
      exitOnError: false,
    });

    this._debugLogger = createLogger({
      level: "debug",
      silent: IS_TEST,
      format: format.combine(
        format.splat(),
        format.timestamp({
          format: "DD.MM.YY HH:mm:ss",
        }),
        format.simple(),
        format.printf(msg =>
          format
            .colorize()
            .colorize(
              msg.level,
              `[${msg.timestamp}] [${msg.level.toUpperCase()}]${
                msg.dependency ? ` [${msg.dependency}]:` : ":"
              } ${msg.message}`
            )
        )
      ),
      transports: [
        new transports.Console({
          level: IS_PRODUCTION ? "info" : "debug",
        }),
      ],
    });
  }

  warning(arg: { dependency?: Dependency; message: string; values?: any[] }) {
    const { message, values, dependency } = arg;

    this._log({
      level: "warn",
      loggers: [this._debugLogger],
      labels: { dependency },
      message,
      values,
    });
  }

  info(arg: { dependency?: Dependency; message: string; values?: any[] }) {
    const { message, values, dependency } = arg;

    this._log({
      level: "info",
      loggers: [this._debugLogger],
      labels: { dependency },
      message,
      values,
    });
  }

  error(arg: {
    dependency?: Dependency;
    message: string;
    error?: any;
    values?: any[];
  }) {
    const { message, values, dependency, error } = arg;

    this._log({
      level: "error",
      loggers: [this._errorsLogger, this._debugLogger],
      labels: { dependency },
      message,
      values,
      additionalData: {
        error: error?.stack || error,
      },
    });
  }

  debug(arg: { dependency?: Dependency; message: string; values?: any[] }) {
    const { message, values, dependency } = arg;

    this._log({
      level: "debug",
      loggers: [this._debugLogger],
      labels: { dependency },
      message,
      values,
    });
  }

  private _log<T = void>(arg: {
    level: string;
    loggers: Logger[];
    message: string;

    values?: any[];
    labels?: {
      dependency?: string;
    };
    additionalData?: T;
  }) {
    const { loggers, level, message, values, labels, additionalData } = arg;

    const interpolation = values ?? [];

    for (const logger of loggers) {
      logger.log(level, message, ...interpolation, {
        ...labels,
        ...additionalData,
      });
    }
  }
}
