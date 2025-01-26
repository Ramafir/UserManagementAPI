import { Response } from "supertest";

export enum Method {
  POST = "post",
  PUT = "put",
  GET = "get",
  DELETE = "delete",
  PATCH = "patch",
}

export interface IRouterInformation {
  version: number;

  name: string;
}

export interface IRequestInformation<Q = void, B = void> {
  method: Method;
  action: string;
  query: Q;
  body?: B;
  session?: UserSession;
}

// @NOTE when using email - cookie is read from RuntimeData.cookie object
export type UserSession = { user: { email: string } } | { cookie: string };

export interface IAttachment {
  field: string;
  file: Buffer;
}

export interface ITestData {
  router: IRouterInformation;
  request: IRequestInformation<any, any>;
  globalCookie: Record<string, string>;
}

export type AuthenticateFunc = (
  user: { email: string },
  options?: {
    routerVersion?: number;
    requestVersion?: number;
  }
) => Promise<string>;

export type GetUrlFunc = (arg: {
  router: IRouterInformation;
  action: string;
}) => string;

export type ExtractTokenFromCookieFunc = (cookie: string | string[]) => string;

export type RequestFunc<Q extends { version: number }, B = void> = (data: {
  query?: Q;
  body?: B;
  session?: UserSession;
  attach?: IAttachment[];
}) => Promise<Response>;

export type CustomRequestFunc<Q extends { version: number }, B = void> = (arg: {
  router: IRouterInformation;
  request: IRequestInformation<Q, B>;
}) => Promise<Response>;

// ------------------------------------------------

export interface ICommonMethods {
  getUrl: GetUrlFunc;
  authenticate: AuthenticateFunc;
  customRequest: CustomRequestFunc<any, any>;
  extractTokenFromCookie: ExtractTokenFromCookieFunc;
}

export interface ITestInstance extends ICommonMethods {
  request: RequestFunc<any, any>;
}

export interface ITestsGroup {
  _data: { runInPrivilegedMode: boolean };

  beforeAll(suite: Mocha.Suite): void;

  loadToSuite(suite: Mocha.Suite): number;
}

export interface IBaseTest<Q = any, B = any> {
  method: Method;

  description: string;

  query?: Q;

  body?: B;
}

export interface ICustomTest extends IBaseTest {
  statusCode: number;

  runner: (arg: {
    url: string;
    router: IRouterInformation;
    request: IRequestInformation;
    testAgent: ITestInstance;
  }) => Promise<Response>;
}

export interface ITest<Q = any, B = any> extends IBaseTest<Q, B> {
  session?: UserSession;

  appendToAction?: string;

  query?: Q & { version: number };

  attach?: IAttachment[];

  expect: {
    statusCode: number;

    callback?: (response: Response) => void;
  };
}
