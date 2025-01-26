import { defineTestsGroup } from "@integration-tests/probata";

import { GET_SESSIONS_CONTROLLER_V1_TESTS } from "./GetSessionsController";
import {
  STATUS_CONTROLLER_V1_BEFORE_HOOK,
  STATUS_CONTROLLER_V1_TESTS,
} from "./StatusController";
import {
  SIGN_IN_CONTROLLER_V1_BEFORE_HOOK,
  SIGN_IN_CONTROLLER_V1_TESTS,
} from "./SignInController";
import {
  SIGN_OUT_CONTROLLER_V1_BEFORE_HOOK,
  SIGN_OUT_CONTROLLER_V1_TESTS,
} from "./SignOutController";
import {
  DELETE_SESSION_CONTROLLER_V1_BEFORE_HOOK,
  DELETE_SESSION_CONTROLLER_V1_TESTS,
} from "./DeleteSessionController";

import { BaseController } from "@controllers/BaseController";
import { StatusController } from "@controllers/Auth/StatusController";
import { SignInController } from "@controllers/Auth/SignInController";
import { SignOutController } from "@controllers/Auth/SignOutController";
import { GetSessionsController } from "@controllers/Auth/GetSessionsController";
import { DeleteSessionController } from "@controllers/Auth/DeleteSessionController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const AUTH_TESTS = defineTestsGroup({
  name: "Auth",
  router: `auth`,
  collection: [
    {
      action: "sign-in",
      controller: SignInController.name,
      testData: [
        {
          routerVersion: v1,
          tests: SIGN_IN_CONTROLLER_V1_TESTS,
        },
      ],
    },
    {
      action: "sign-out",
      controller: SignOutController.name,
      testData: [
        {
          routerVersion: v1,
          tests: SIGN_OUT_CONTROLLER_V1_TESTS,
        },
      ],
    },
    {
      action: "sessions",
      controller: GetSessionsController.name,
      testData: [
        {
          routerVersion: v1,
          tests: GET_SESSIONS_CONTROLLER_V1_TESTS,
        },
      ],
    },
    {
      action: "sessions",
      controller: DeleteSessionController.name,
      testData: [
        {
          routerVersion: v1,
          tests: DELETE_SESSION_CONTROLLER_V1_TESTS,
        },
      ],
    },
    {
      action: "status",
      controller: StatusController.name,
      testData: [
        {
          routerVersion: v1,
          tests: STATUS_CONTROLLER_V1_TESTS,
        },
      ],
    },
  ],
  hooks: {
    before: () => {
      return Promise.all([
        SIGN_IN_CONTROLLER_V1_BEFORE_HOOK(),
        SIGN_OUT_CONTROLLER_V1_BEFORE_HOOK(),
        DELETE_SESSION_CONTROLLER_V1_BEFORE_HOOK(),
        STATUS_CONTROLLER_V1_BEFORE_HOOK(),
      ]);
    },
  },
});
