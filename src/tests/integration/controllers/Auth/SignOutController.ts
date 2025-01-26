import { expect } from "chai";
import { StatusCodes as HTTP } from "http-status-codes";
import { IAuthService } from "types/services/IAuthService";
import { Method, defineTests } from "@integration-tests/probata";
import { addUsers } from "@integration-tests/helpers/db/addUsers";
import { NO_PERMISSIONS_ROLE_ID } from "@integration-tests/config";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const SIGN_OUT_MEMBER_EMAIL = "sign-out@email.com";

const baseQuery = { version: v1 };

export const SIGN_OUT_CONTROLLER_V1_BEFORE_HOOK = async () => {
  return addUsers([
    {
      email: SIGN_OUT_MEMBER_EMAIL,
      isSignedUp: true,
      roleNameOrId: NO_PERMISSIONS_ROLE_ID,
    },
  ]);
};

export const SIGN_OUT_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.POST,
    baseQuery,
  },

  ({ addTest, addCustomTest }) => {
    includeGeneralTests({
      addTest,
      baseQuery,
    });

    addCustomTest({
      description: `returns ${HTTP.OK} when user signs out of app`,
      statusCode: HTTP.OK,
      runner: async ({ testAgent }) => {
        const authService = getInstanceOf<IAuthService>(Di.AuthService);

        const cookie = await testAgent.authenticate({
          email: SIGN_OUT_MEMBER_EMAIL,
        });

        const jsonwebtoken = testAgent.extractTokenFromCookie(cookie);

        const result = authService.verifyToken(jsonwebtoken);

        if (result.error) {
          throw Error("Invalid token!");
        }

        const response = await testAgent.request({ session: { cookie } });

        const {
          payload: { id, sessionId },
        } = result;

        const sessionStatus = await authService.isSessionActive(id, sessionId);

        expect(sessionStatus).to.equal(false);

        return response;
      },
    });
  }
);
