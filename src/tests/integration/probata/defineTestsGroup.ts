import Mocha from "mocha";
import { expect } from "chai";
import { Response } from "supertest";
import TestAgent from "supertest/lib/agent";
import { IRuntimeData } from "@integration-tests/types/IRuntimeData";
import { ICustomTest, IRouterInformation, ITest, ITestsGroup } from ".";
import {
  ROUTER_VERSION_PREFIX,
  RUNTIME_DATA_DI_TOKEN,
} from "@integration-tests/config";

import { useTestAgent } from "./useTestAgent";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const defineTestsGroup = (arg: {
  name: string;
  router: string;
  collection: {
    action: string;
    controller: string;
    testData: {
      routerVersion: number;
      tests: (ITest | ICustomTest)[];
    }[];
  }[];
  runInPrivilegedMode?: boolean; // @NOTE turns on privileged mode = runs only tests groups with flag enabled
  hooks?: {
    before?: Mocha.Func;
  };
}): ITestsGroup => {
  const { name: suiteId, router, hooks, collection, runInPrivilegedMode } = arg;

  return {
    _data: {
      runInPrivilegedMode: !!runInPrivilegedMode,
    },

    beforeAll(suite: Mocha.Suite) {
      if (!hooks?.before) {
        return;
      }

      const relatedSuite = suite.suites.find(
        element => element.title === suiteId
      );

      if (relatedSuite) {
        relatedSuite.beforeAll(hooks.before);
      }
    },
    loadToSuite: (suite: Mocha.Suite) => {
      let testsCount = 0;

      const entitySuite = Mocha.Suite.create(suite, suiteId);

      for (const element of collection) {
        const { controller, testData, action } = element;

        const controllerSuite = Mocha.Suite.create(
          entitySuite,
          `${controller}`
        );

        for (const element of testData) {
          const { routerVersion, tests } = element;
          const translatedRouterVersion = `${ROUTER_VERSION_PREFIX}${routerVersion}`;

          for (const test of tests) {
            const mochaTest = new Mocha.Test(
              `${translatedRouterVersion} ${test.description}`,
              async () => {
                const { supertest, globalCookie } = getInstanceOf<IRuntimeData>(
                  RUNTIME_DATA_DI_TOKEN
                ).getData();

                if (!supertest) {
                  throw Error(`Supertest not supplied!`);
                }

                await runTest({
                  test,
                  action,
                  supertest,
                  globalCookie,
                  router: { version: routerVersion, name: router },
                });
              }
            );

            controllerSuite.addTest(mochaTest);

            testsCount++;
          }
        }
      }

      return testsCount;
    },
  };
};

async function runTest(arg: {
  action: string;
  supertest: TestAgent;
  router: IRouterInformation;
  test: ITest | ICustomTest;
  globalCookie: Record<string, string>;
}) {
  const { action: baseAction, supertest, router, test, globalCookie } = arg;
  const isCustomTest = "runner" in test;

  let action = baseAction;

  if (!isCustomTest && test.appendToAction) {
    action += `${action.length ? "/" : ""}${test.appendToAction}`;
  }

  const request = {
    method: test.method,
    action,
    query: test.query,
    body: test.body,
  };

  const testAgent = useTestAgent(supertest, {
    router,
    request,
    globalCookie,
  });

  let response: Response;
  const statusCode = isCustomTest ? test.statusCode : test.expect.statusCode;

  if (isCustomTest) {
    const url = testAgent.getUrl({
      router,
      action,
    });

    response = await test.runner({ url, router, testAgent, request });
  } else {
    const {
      attach,
      session,
      expect: { callback },
    } = test;

    response = await testAgent.request({
      attach,
      session,
    });

    if (callback) {
      callback(response);
    }
  }

  expect(response.status).to.eql(statusCode);
}
