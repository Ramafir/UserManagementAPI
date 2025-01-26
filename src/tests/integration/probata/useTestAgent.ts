import TestAgent from "supertest/lib/agent";
import { PASSWORD, ROUTER_VERSION_PREFIX } from "@integration-tests/config";
import {
  Method,
  ITestData,
  IAttachment,
  RequestFunc,
  UserSession,
  ITestInstance,
  ICommonMethods,
  IRouterInformation,
  IRequestInformation,
} from ".";

import { APP, JWT } from "@config";

import { BaseController } from "@controllers/BaseController";

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

let supertest: TestAgent;
let availableGlobalCookies: Record<string, string>;

export function useTestAgent(agent: TestAgent): ICommonMethods;
export function useTestAgent(
  agent: TestAgent,
  testData: ITestData
): ITestInstance;
export function useTestAgent(
  agent: TestAgent,
  testData?: ITestData
): ICommonMethods | ITestInstance {
  supertest = agent;

  const commonMethods = {
    getUrl,
    authenticate,
    customRequest,
    extractTokenFromCookie,
  };

  if (testData) {
    const { globalCookie, ...otherData } = testData;

    availableGlobalCookies = globalCookie;

    return {
      ...commonMethods,
      request: prepareRequest({ ...otherData }),
    };
  }

  return commonMethods;
}

function extractTokenFromCookie(cookie: string | string[]) {
  const isArray = Array.isArray(cookie);

  let tokenCookie = isArray ? "" : cookie;

  if (isArray) {
    for (const part of cookie) {
      if (part.includes(JWT.COOKIE_KEY)) {
        tokenCookie = part;

        break;
      }
    }
  }

  const startText = `${JWT.COOKIE_KEY}=`;
  const endText = ";";

  const start = tokenCookie.indexOf(startText) + startText.length;
  const end = tokenCookie.indexOf(endText, start);

  return tokenCookie.substring(start, end);
}

function prepareRequest<Q extends { version: number }, B = void>(arg: {
  router: IRouterInformation;
  request: IRequestInformation<Q, B>;
}): RequestFunc<Q, B> {
  const {
    router,
    request: { action, method, query: baseQuery, body: baseBody },
  } = arg;

  const url = getUrl({ router, action });

  return data => {
    const { query, body, session, attach } = data;

    return sendRequest({
      url,
      attach,
      method,
      session,
      body: body || baseBody,
      query: query || baseQuery,
    });
  };
}

function customRequest<Q extends { version: number }, B = void>(arg: {
  router: IRouterInformation;
  request: IRequestInformation<Q, B>;
}) {
  const {
    router,
    request: { action, method, query, body, session },
  } = arg;

  const url = getUrl({ router, action });

  return sendRequest({
    method,
    url,
    body,
    query,
    session,
  });
}

function sendRequest(arg: {
  method: Method;
  url: string;
  body: any;
  query: any;
  session?: UserSession;
  attach?: IAttachment[];
}) {
  const { method, url, session, query, body, attach } = arg;

  const request = supertest[method](url);

  if (query) {
    request.query(query);
  }

  if (session) {
    request.set("Cookie", useCookie(session));
  }

  if (attach) {
    attach.map(({ field, file }) =>
      request.attach(field, file, { filename: field })
    );

    return request;
  }

  return body ? request.send(body) : request.send();
}

function getUrl(arg: { router: IRouterInformation; action: string }) {
  const {
    action,
    router: { version, name },
  } = arg;

  const branchVersion = `${ROUTER_VERSION_PREFIX}${version}`;

  return `${APP.ROUTES_PREFIX}/${branchVersion}/${name}/${action}`;
}

async function authenticate(
  user: { email: string },
  options?: {
    routerVersion?: number;
    requestVersion?: number;
  }
): Promise<string> {
  const { email } = user;

  const url = getUrl({
    action: "sign-in",
    router: {
      version: options?.routerVersion || v1,
      name: "auth",
    },
  });

  const response = await supertest
    .post(url)
    .query({ version: options?.requestVersion || v1 })
    .send({ email, password: PASSWORD });

  const cookie = response.headers["set-cookie"];

  return cookie;
}

function useCookie(session: UserSession) {
  if ("user" in session) {
    const {
      user: { email },
    } = session;

    if (!availableGlobalCookies[email]) {
      throw Error(
        `Expected to have global session of ${email} but it wasn't found!`
      );
    }

    return [availableGlobalCookies[email]];
  }

  return [session["cookie"]];
}
