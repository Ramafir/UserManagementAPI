import { DataSource } from "typeorm";

export interface IDataSourceFactory {
  create(): Promise<DataSource>;
}
