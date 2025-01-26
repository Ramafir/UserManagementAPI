import type { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";
import { IBaseRepository } from "types/repositories/IBaseRepository";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const isLimitNotReached = <P, B, Q>(
  repositoryName: Di,
  limit: number
) => {
  return async (
    request: CustomRequest<P, B, Q>,
    response: Response,
    next: NextFunction
  ) => {
    const repository = getInstanceOf<IBaseRepository<unknown>>(repositoryName);

    const [entityName] = repositoryName.slice(1).split("Repository");

    const [, total] = await repository.getAllAndCount({ skip: 0, take: 1 });

    if (total > limit) {
      return response
        .status(HTTP.BAD_REQUEST)
        .send(
          `Cannot create more (${entityName}) entities. Limit (${limit}) reached! Please ask administrator to change it, if you really need more.`
        );
    }

    return next();
  };
};
