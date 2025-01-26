import type { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";

import { formatError } from "@helpers/yup/formatError";

import { useVersionSchema } from "@schemas/common/useVersionSchema";

// @NOTE do not mix with "validateRequestWith"
export const requireEndpointVersion = <P, B, Q>(versions: number[]) => {
  return async (
    request: CustomRequest<P, B, Q>,
    response: Response,
    next: NextFunction
  ) => {
    if (!versions.length) {
      return response.status(HTTP.NOT_IMPLEMENTED).send();
    }

    const versionSchema = useVersionSchema(versions);

    try {
      await versionSchema.validate(request.query, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (error) {
      return response.status(HTTP.BAD_REQUEST).send(formatError(error));
    }

    next();
  };
};
