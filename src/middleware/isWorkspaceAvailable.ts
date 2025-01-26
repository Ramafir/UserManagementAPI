import { StatusCodes as HTTP } from "http-status-codes";
import type { Request, NextFunction, Response } from "express";
import { IWorkspaceRepository } from "types/repositories/IWorkspaceRepository";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

// @NOTE better to use in case of "parseUploadFormData" middleware
export const IsWorkspaceAvailable = (() => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const workspaceRepository = getInstanceOf<IWorkspaceRepository>(
      Di.WorkspaceRepository
    );

    const {
      query: { workspaceId },
    } = request;

    if (!workspaceId || typeof workspaceId !== "string") {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    const workspace = await workspaceRepository.getById(parseInt(workspaceId));

    if (!workspace) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    next();
  };
})();
