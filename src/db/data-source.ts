import { SeederOptions } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";

import { DATABASE, APP } from "@config";

const { BASE_DIR, IS_PRODUCTION } = APP;
const { HOST, NAME, PORT, TYPE, ROOT } = DATABASE;

const options: DataSourceOptions & SeederOptions = {
  type: TYPE,
  host: HOST,
  port: PORT,
  username: ROOT.USERNAME,
  password: ROOT.PASSWORD,
  database: NAME,
  entities: [`${BASE_DIR}/db/entities/*`],
  migrations: [`${BASE_DIR}/db/migrations/*`],
  subscribers: [`${BASE_DIR}/db/subscribers/*`],
  logging: !IS_PRODUCTION,
  synchronize: false,
};

export const dataSource = new DataSource(options);
