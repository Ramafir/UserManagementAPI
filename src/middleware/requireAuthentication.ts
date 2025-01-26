import { DataStore } from "types/DataStore";
import type { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";
import { IAuthService } from "types/services/IAuthService";
import { IUserRepository } from "types/repositories/IUserRepository";

import { JWT } from "@config";
import { PERMISSIONS_AS_ARRAY } from "@config/permissions";

import { Di } from "@enums/Di";
import { Dependency } from "@enums/Dependency";
import { Permission } from "@shared/types/enums/Permission";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const requireAuthentication = (<P, B, Q>() => {
  return async (
    request: CustomRequest<P, B, Q>,
    response: Response,
    next: NextFunction
  ) => {
    const authService = getInstanceOf<IAuthService>(Di.AuthService);

    const tokenPayload = readToken(request, authService);

    if (!tokenPayload) {
      log.debug({
        message: "Failed to authenticate (missing token)!",
      });

      return response.status(HTTP.UNAUTHORIZED).send();
    }

    const { id: userId, sessionId } = tokenPayload;

    const isSessionActive = await authService.isSessionActive(
      userId,
      sessionId
    );

    if (!isSessionActive) {
      response.clearCookie(JWT.COOKIE_KEY);

      return response.status(HTTP.UNAUTHORIZED).send();
    }

    request.userId = userId;
    request.sessionId = sessionId;

    const userRepository = getInstanceOf<IUserRepository>(Di.UserRepository);

    const roleId = await userRepository.getRoleId(userId);

    if (!roleId) {
      return response.status(HTTP.UNAUTHORIZED).send();
    }

    const role = await authService.getRoleFromDataStore(roleId);

    if (!role) {
      return response.status(HTTP.UNAUTHORIZED).send();
    }

    assignPermissionsToRequest(request, role.permissions);

    next();
  };
})();

function readToken<P, B, Q>(
  request: CustomRequest<P, B, Q>,
  authService: IAuthService
) {
  const token = request.cookies[JWT.COOKIE_KEY];

  if (!token) {
    return null;
  }

  const result = authService.verifyToken(token);

  if (result.error) {
    log.error({
      error: result.error,
      message: `Failed to verify token`,
      dependency: Dependency.JWT,
    });

    return null;
  }

  const { payload } = result;

  return payload;
}

function assignPermissionsToRequest<P, B, Q>(
  request: CustomRequest<P, B, Q>,
  rolePermissions: DataStore.Permission[]
) {
  const requestPermissions: Partial<{ [key in Permission]: boolean }> = {};

  PERMISSIONS_AS_ARRAY.map(permissionDefinition => {
    const rolePermission = rolePermissions.find(
      ({ signature }) => signature === permissionDefinition.signature
    );

    requestPermissions[permissionDefinition.signature] = rolePermission
      ? rolePermission.enabled
      : false;
  });

  request.permissions = requestPermissions;
}
