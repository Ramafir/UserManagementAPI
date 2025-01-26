import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { SUPER_USER_EMAIL, WORKSPACE_1 } from "@integration-tests/config";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";
import { includeWorkspaceEntityTests } from "@integration-tests/helpers/includeWorkspaceEntityTests";

import { includeAddUpdateTests } from "./includeAddUpdateTests";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const baseQuery = { version: v1 };
const workspaceQuery = { ...baseQuery, workspaceId: WORKSPACE_1.id };

export const ADD_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.POST,
    baseQuery,
  },

  ({ addTest }) => {
    includeGeneralTests({
      addTest,
      baseQuery: workspaceQuery,
    });

    includeWorkspaceEntityTests({
      addTest,
      baseQuery: workspaceQuery,
    });

    const { validBody } = includeAddUpdateTests({
      addTest,
      baseQuery: workspaceQuery,
    });

    addTest({
      description: `returns ${HTTP.CREATED} when blueprint is created`,
      session: { user: { email: SUPER_USER_EMAIL } },
      query: workspaceQuery,
      body: validBody,
      expect: {
        statusCode: HTTP.CREATED,
      },
    });
  }
);
