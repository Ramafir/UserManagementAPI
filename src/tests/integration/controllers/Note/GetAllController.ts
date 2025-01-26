import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";
import { includePaginationTests } from "@integration-tests/helpers/includePaginationTests";
import {
  FILE_1,
  SUPER_USER_EMAIL,
  WORKSPACE_1,
} from "@integration-tests/config";
import { includeWorkspaceEntityTests } from "@integration-tests/helpers/includeWorkspaceEntityTests";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const workspaceId = WORKSPACE_1.id;
const baseQuery = { version: v1, workspaceId };
const baseQueryWithFileId = { ...baseQuery, fileId: FILE_1.id };

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

    includePaginationTests({
      addTest,
      baseQuery,
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when fileId is missing`,
      session: { user: { email: SUPER_USER_EMAIL } },
      query: {
        ...baseQuery,
        page: 1,
        perPage: 10,
      },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.OK} on valid request`,
      session: { user: { email: SUPER_USER_EMAIL } },
      query: {
        ...baseQueryWithFileId,
        page: 1,
        perPage: 10,
      },
      expect: {
        statusCode: HTTP.OK,
      },
    });
  }
);
