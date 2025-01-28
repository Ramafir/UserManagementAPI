import { Request, Response } from "express";

export {};

declare global {
  namespace Express {
    export interface Request {
      // @NOTE -> available only after `requireAuthentication`
      userId: number;
      sessionId: string;
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
}
