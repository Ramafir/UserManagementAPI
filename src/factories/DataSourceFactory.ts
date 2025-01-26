import { SeederOptions } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";
import { IDataSourceFactory } from "types/factories/IDataSourceFactory";

import { APP, DATABASE } from "@config";

import { Dependency } from "@enums/Dependency";

export class DataSourceFactory implements IDataSourceFactory {
  create() {
    const { BASE_DIR, IS_PRODUCTION, IS_TEST } = APP;
    const { HOST, NAME, PORT, TYPE, ROOT } = DATABASE;

    log.debug({
      dependency: Dependency.TypeORM,
      message: "Creating data source...",
    });

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
      logging: !IS_PRODUCTION && !IS_TEST,
      synchronize: false,
    };

    const dataSource = new DataSource(options);

    return dataSource.initialize();
  }
}
