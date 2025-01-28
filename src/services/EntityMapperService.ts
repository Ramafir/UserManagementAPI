import { BaseMapper } from '@mappers/BaseMapper';
import { IEntityMapperService } from 'types/services/IEntityMapperService';

export class EntityMapperService implements IEntityMapperService {
    map<T>(entity: T): {
        to: <Y extends BaseMapper<T>>(mapper: new (data: T) => Y) => Y;
    };

    map<T>(entity: T[]): {
        to: <Y extends BaseMapper<T>>(mapper: new (data: T) => Y) => Y[];
    };

    map<T>(
        entity: T | T[]
    ):
        | { to: <Y extends BaseMapper<T>>(mapper: new (data: T) => Y) => Y }
        | { to: <Y extends BaseMapper<T>>(mapper: new (data: T) => Y) => Y[] } {
        return Array.isArray(entity)
            ? {
                  to: <Y extends BaseMapper<T>>(mapper: new (data: T) => Y) => {
                      return entity.map(entity => new mapper(entity));
                  },
              }
            : {
                  to: <Y extends BaseMapper<T>>(mapper: new (data: T) => Y) => {
                      return new mapper(entity);
                  },
              };
    }
}
