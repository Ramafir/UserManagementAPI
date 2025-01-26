import { ClassType } from "types/ClassType";
import { IBaseRepository } from "types/repositories/IBaseRepository";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import {
  DataSource,
  Repository,
  DeepPartial,
  QueryRunner,
  UpdateResult,
  FindOneOptions,
  FindManyOptions,
  FindOptionsWhere,
  SaveOptions,
} from "typeorm";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

export class BaseRepository<T extends { id: number | string }>
  implements IBaseRepository<T>
{
  protected database: Repository<T>;

  public useTransaction: () => Promise<QueryRunner>;

  constructor(entity: ClassType<T>) {
    const dataSource = getInstanceOf<DataSource>(Di.DataSource);

    this.database = dataSource.getRepository(entity);

    this.useTransaction = async () => {
      const queryRunner = dataSource.createQueryRunner();

      await queryRunner.connect();

      await queryRunner.startTransaction();

      return queryRunner;
    };
  }

  createEntity(properties?: DeepPartial<T>): T {
    if (!properties) {
      return this.database.create();
    }

    return this.database.create(properties);
  }

  getAll(options: FindManyOptions<T>): Promise<T[]> {
    return this.database.find(options);
  }

  getAllAndCount(options: FindManyOptions<T>): Promise<[T[], number]> {
    return this.database.findAndCount(options);
  }

  getOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.database.findOne(options);
  }

  getById(id: number | string): Promise<T | null> {
    return this.database.findOneBy({ id } as FindOptionsWhere<T>);
  }

  hardDeleteEntity(entity: T): Promise<T> {
    return this.database.remove(entity);
  }

  softDelete(options: FindOptionsWhere<T>): Promise<UpdateResult> {
    return this.database.softDelete(options);
  }

  softDeleteEntity(entity: T, options?: SaveOptions): Promise<T> {
    return this.database.softRemove(entity, options);
  }

  primitiveSave(entity: DeepPartial<T>, options?: SaveOptions): Promise<T> {
    return this.database.save(entity, options);
  }

  // @NOTE OUTPUT or RETURNING clause only supported by Microsoft SQL Server or PostgreSQL or MariaDB databases.
  primitiveUpdate(
    options: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>
  ): Promise<UpdateResult> {
    return this.database.update(options, partialEntity);
  }
}
