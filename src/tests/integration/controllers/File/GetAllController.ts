import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";
import { includeWorkspaceEntityTests } from "@integration-tests/helpers/includeWorkspaceEntityTests";
import {
  WORKSPACE_1,
  SUPER_USER_EMAIL,
  UNEXISTING_ITEM_ID,
  BLUEPRINT_1,
} from "@integration-tests/config";

import { FILES } from "@config";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const workspaceId = WORKSPACE_1.id;
const baseQuery = { version: v1, workspaceId };

export const GET_ALL_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.GET,
    baseQuery,
  },

  ({ addTest }) => {
    includeGeneralTests({
      addTest,
      baseQuery,
    });

    includeWorkspaceEntityTests({
      addTest,
      baseQuery,
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when request is missing blueprintId and relativePath`,
      session: { user: { email: SUPER_USER_EMAIL } },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when request includes unexisting blueprintId`,
      session: { user: { email: SUPER_USER_EMAIL } },
      query: {
        ...baseQuery,
        blueprintId: UNEXISTING_ITEM_ID,
      },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.OK} when request includes blueprintId`,
      session: { user: { email: SUPER_USER_EMAIL } },
      query: {
        ...baseQuery,
        blueprintId: BLUEPRINT_1.id,
      },
      expect: {
        statusCode: HTTP.OK,
      },
    });

    // @TODO include invalid relativePath tests

    addTest({
      description: `returns ${HTTP.OK} when request includes relativePath`,
      session: { user: { email: SUPER_USER_EMAIL } },
      query: {
        ...baseQuery,
        relativePath: `${FILES.ROOT}`,
      },
      expect: {
        statusCode: HTTP.OK,
      },
    });
  }
);
