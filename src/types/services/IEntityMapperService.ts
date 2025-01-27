import { BaseMapper } from "@mappers/BaseMapper";

export interface IEntityMapperService {
  map<T>(entity: T): {
    to: <Y extends BaseMapper<T>>(mapper: new (data: T) => Y) => Y;
  };

  map<T>(entity: T[]): {
    to: <Y extends BaseMapper<T>>(mapper: new (data: T) => Y) => Y[];
  };
}
