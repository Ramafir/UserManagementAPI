import yup from "yup";
import { DeepPartial, FindOptionsWhere } from "typeorm";
import { IBaseRepository } from "types/repositories/IBaseRepository";

import { Di } from "@enums/Di";

declare module "yup" {
  export type WhereBuilder<T> = (value: number | string) => FindOptionsWhere<T>;

  interface NumberSchema {
    isEntityAvailable<T>(
      repositoryToken: string,
      where: WhereBuilder<T>,
      message?: string
    ): this;
  }

  interface StringSchema {
    isEntityAvailable<T>(
      repositoryToken: string,
      where: WhereBuilder<T>,
      message?: string
    ): this;
  }

  // @NOTE https://vee-validate.logaretm.com/v3/advanced/server-side-validation.html#setting-errors-manually
  export type FormattedError = Record<string, string[]>;
}
