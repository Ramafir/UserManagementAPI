import { FindOptionsWhere } from "typeorm";
import { IBaseRepository } from "types/repositories/IBaseRepository";
import {
  number,
  string,
  Schema,
  addMethod,
  WhereBuilder,
  NumberSchema,
  StringSchema,
} from "yup";

import { getInstanceOf } from "@helpers/getInstanceOf";

function handleRule<T extends Schema>(
  instance: T,
  repositoryToken: string,
  where: WhereBuilder<T>,
  message?: string
) {
  return instance.test(async (value, ctx) => {
    if (!value) {
      return ctx.createError();
    }

    const repository = getInstanceOf<IBaseRepository<unknown>>(repositoryToken);

    const result = await repository.getOne({
      where: where
        ? where(value)
        : ({
            id: value,
          } as FindOptionsWhere<T>),
    });

    if (!result) {
      return ctx.createError({
        message: message || "Resource not available",
      });
    }

    return true;
  });
}

function isEntityAvailableNumber<T>(
  this: NumberSchema,
  repositoryToken: string,
  where: WhereBuilder<T>,
  message?: string
) {
  return handleRule(this, repositoryToken, where, message);
}

function isEntityAvailableString<T>(
  this: StringSchema,
  repositoryToken: string,
  where: WhereBuilder<T>,
  message?: string
) {
  return handleRule(this, repositoryToken, where, message);
}

addMethod<NumberSchema>(number, "isEntityAvailable", isEntityAvailableNumber);
addMethod<StringSchema>(string, "isEntityAvailable", isEntityAvailableString);
