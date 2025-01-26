import type { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";

import { Permission } from "@shared/types/enums/Permission";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

export const requirePermissions = <P, B, Q>(
  context: Permission[],
  options: {
    condition?: "OR" | "AND";
  } = {}
) => {
  return async (
    request: CustomRequest<P, B, Q>,
    response: Response,
    next: NextFunction
  ) => {
    const { permissions } = request;

    if (!permissions) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    if (!context.length) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    const condition = options.condition || "AND";
    const isOrCondition = condition === "OR";

    let enabledPermissions = 0;

    for (const permission of context) {
      const isEnabled = isPermissionEnabled(permission, permissions);

      if (isEnabled) {
        enabledPermissions++;
      } else if (!isOrCondition && !isEnabled) {
        break;
      }

      if (isOrCondition && enabledPermissions > 0) {
        break;
      }
    }

    if (
      !enabledPermissions ||
      (!isOrCondition && enabledPermissions !== context.length)
    ) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    return next();
  };
};

export const requirePermissionsCustomHandler = <P, B, Q>(
  handler: (request: CustomRequest<P, B, Q>) => boolean
) => {
  return async (
    request: CustomRequest<P, B, Q>,
    response: Response,
    next: NextFunction
  ) => {
    const { permissions } = request;

    if (!permissions) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const hasRequiredPermissions = handler(request);

    return hasRequiredPermissions
      ? next()
      : response.status(HTTP.FORBIDDEN).send();
  };
};
