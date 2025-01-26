import jwt, { JwtPayload as IJwtPayload } from "jsonwebtoken";

declare module "jsonwebtoken" {
  export class JwtPayload implements IJwtPayload {
    id: number;

    email: string;

    sessionId: string;
  }

  export type VerifyTokenResult =
    | {
        error: VerifyErrors;
        payload?: undefined;
      }
    | { payload: JwtPayload; error?: undefined };
}
