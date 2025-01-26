import { StatusCodes as HTTP } from "http-status-codes";
import { SUPER_USER_EMAIL } from "@integration-tests/config";
import { Method, defineTests } from "@integration-tests/probata";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const baseQuery = { version: v1 };

export const GET_SESSIONS_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.GET,
    baseQuery,
  },

  ({ addTest }) => {
    includeGeneralTests({
      addTest,
      baseQuery,
    });

    addTest({
      description: `returns ${HTTP.OK} when user is signed in`,
      session: { user: { email: SUPER_USER_EMAIL } },
      expect: {
        statusCode: HTTP.OK,
      },
    });
  }
);
