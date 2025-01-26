import formidable from "formidable";
import { Permission } from "@shared/types/enums/Permission";
import { Request, Response } from "express";

import { IFormDataFile } from "types/IFormDataFile";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      // @NOTE -> available only after `requireAuthentication`
      userId: number;
      sessionId: string;

      // @NOTE -> available only after `requireAuthentication`
      permissions: RequestPermissions;

      // @NOTE -> available only after `parseWorkspaceFormData`
      files: IFormDataFile[];
    }
  }

  export type CustomRequest<P = void, B = void, Q = void> = Request<
    P,
    unknown,
    B,
    Q & {
      version: string;
    }
  >;

  export type CustomResponse<T> = Response<T, Record<string, T>>;

  export type RequestPermissions = { [key in Permission]?: boolean };
}
