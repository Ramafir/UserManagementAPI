import { SeederOptions } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";

import { DATABASE, APP } from "@config";

import { Environment } from "@enums/Environment";

const { IS_PRODUCTION } = APP;
const { HOST, NAME, PORT, TYPE, ROOT } = DATABASE;

const getGlobPattern = (path: string) => `src/db/${path}`;

const seeds = [getGlobPattern(`seeds/common/*Seeder*`)];

if (APP.IS_DEVELOPMENT) {
  seeds.push(getGlobPattern(`seeds/${Environment.Production}/*Seeder*`));
}

seeds.push(getGlobPattern(`seeds/${APP.ENV}/*Seeder*`));

const options: DataSourceOptions & SeederOptions = {
  type: TYPE,
  host: HOST,
  port: PORT,
  username: "root",
  password: ROOT.PASSWORD,
  database: NAME,
  entities: [getGlobPattern(`entities/*`)],
  migrations: [getGlobPattern(`migrations/*`)],
  logging: true,
  synchronize: false,

  seeds,
  factories: IS_PRODUCTION ? [] : [getGlobPattern(`factories/*`)],
};

export const commandDataSource = new DataSource(options);
