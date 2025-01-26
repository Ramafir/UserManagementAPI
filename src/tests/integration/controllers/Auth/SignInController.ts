import { expect } from "chai";
import { StatusCodes as HTTP } from "http-status-codes";
import { IAuthService } from "types/services/IAuthService";
import { Method, defineTests } from "@integration-tests/probata";
import { addUsers } from "@integration-tests/helpers/db/addUsers";
import {
  NO_PERMISSIONS_ROLE_ID,
  PASSWORD,
  SUPER_USER_EMAIL,
} from "@integration-tests/config";

import { Di } from "@enums/Di";
import { ISignInDTO } from "@shared/types/DTOs/Auth";
import { MAX_SESSIONS_PER_USER } from "@shared/constants/config";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const VALID_REQUEST_EMAIL = "session@email.com";
const SESSION_LIMIT_EMAIL = "session-limit@email.com";
const NOT_SIGNED_UP_TEST_EMAIL = "not-signed-up@email.com";

const BASE_QUERY = { version: v1 };

export const SIGN_IN_CONTROLLER_V1_BEFORE_HOOK = async () => {
  return addUsers([
    {
      email: VALID_REQUEST_EMAIL,
      isSignedUp: true,
      roleNameOrId: NO_PERMISSIONS_ROLE_ID,
    },
    {
      email: NOT_SIGNED_UP_TEST_EMAIL,
      isSignedUp: false,
      roleNameOrId: NO_PERMISSIONS_ROLE_ID,
    },
    {
      email: SESSION_LIMIT_EMAIL,
      isSignedUp: true,
      roleNameOrId: NO_PERMISSIONS_ROLE_ID,
    },
  ]);
};

export const SIGN_IN_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.POST,
    baseQuery: BASE_QUERY,
  },

  ({ addTest, addCustomTest }) => {
    addTest<void, ISignInDTO>({
      description: `returns ${HTTP.BAD_REQUEST} on empty form`,
      body: { email: "", password: "" },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest<void, ISignInDTO>({
      description: `returns ${HTTP.BAD_REQUEST} on invalid email`,
      body: { email: "invalid-email", password: PASSWORD },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest<void, ISignInDTO>({
      description: `returns ${HTTP.UNAUTHORIZED} when user does not exist`,
      body: { email: "doesNotExist@email.com", password: "thisIsMyPassword" },
      expect: {
        statusCode: HTTP.UNAUTHORIZED,
      },
    });

    addTest<void, ISignInDTO>({
      description: `returns ${HTTP.UNAUTHORIZED} when user exists but did not sign up yet`,
      body: { email: NOT_SIGNED_UP_TEST_EMAIL, password: PASSWORD },
      expect: {
        statusCode: HTTP.UNAUTHORIZED,
      },
    });

    addTest<void, ISignInDTO>({
      description: `returns ${HTTP.UNAUTHORIZED} when user exists but password is invalid`,
      body: { email: SUPER_USER_EMAIL, password: "thisIsMyPassword" },
      expect: {
        statusCode: HTTP.UNAUTHORIZED,
      },
    });

    addCustomTest({
      description: `returns ${HTTP.UNAUTHORIZED} when user reaches out max number of sessions`,
      statusCode: HTTP.UNAUTHORIZED,
      runner: async ({ testAgent }) => {
        const body: ISignInDTO = {
          email: SESSION_LIMIT_EMAIL,
          password: PASSWORD,
        };

        for (let index = 0; index < MAX_SESSIONS_PER_USER; index++) {
          await testAgent.request({ body });
        }

        return testAgent.request({ body });
      },
    });

    addTest<void, ISignInDTO>({
      description: `returns ${HTTP.OK} when user types valid credentials and has available session`,
      body: { email: VALID_REQUEST_EMAIL, password: PASSWORD },
      expect: {
        statusCode: HTTP.OK,
        callback: async response => {
          const userId = response.body.id;
          const authService = getInstanceOf<IAuthService>(Di.AuthService);

          const sessionKeys = await authService.getSessionKeys(userId);

          expect(sessionKeys).to.have.lengthOf(1);

          expect(response.headers).to.haveOwnProperty("set-cookie");
        },
      },
    });
  }
);
