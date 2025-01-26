import env from "env-var";
import dotenv from "dotenv";

dotenv.config({});

import { Environment } from "@enums/Environment";
import { DatabaseType } from "@enums/DatabaseType";

const envString = (name: string) => env.get(name).required().asString();
const envPort = (name: string) => env.get(name).required().asPortNumber();
const envEnum = <T extends object>(name: string, type: T) =>
  env.get(name).required().asEnum(Object.values(type));

const ENV = <Environment>envEnum("NODE_ENV", Environment);

if (ENV === Environment.Test) {
  dotenv.config({ path: ".env.test", override: true });
}

export const APP = {
  PORT: envPort("PORT"),
  URL: envString("APP_URL"),
  ENV,
  ROUTES_PREFIX: envString("ROUTES_PREFIX"),
  IS_CLEARING_TEMPORARY_UPLOADS_DIR: false,
  MAX_ITEMS_PER_PAGE: 20,
  BASE_DIR: ENV === Environment.Production ? "dist" : "src",
  IS_TEST: ENV === Environment.Test,
  IS_PRODUCTION: ENV === Environment.Production,
  IS_DEVELOPMENT: ENV === Environment.Development,
};

export const DATABASE = {
  NAME: envString("DATABASE_NAME"),
  TYPE: <DatabaseType>envEnum("DATABASE_TYPE", DatabaseType),
  ROOT: {
    USERNAME: "root",
    PASSWORD: envString("DATABASE_ROOT_PASSWORD"),
  },
  HOST: envString("DATABASE_HOST"),
  PORT: envPort("DATABASE_PORT"),
};
