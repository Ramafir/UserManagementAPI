import { string } from "yup";
import { FindOptionsWhere } from "typeorm";

export const useIdStringSchema = <T extends { id: string }>(
  repositoryName: string,
  where?: FindOptionsWhere<T>
) =>
  string()
    .required()
    .isEntityAvailable<T>(
      repositoryName,
      value =>
        ({
          id: value,
          ...where,
        } as FindOptionsWhere<T>)
    );
