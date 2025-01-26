import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { WORKSPACE_1, SUPER_USER_EMAIL } from "@integration-tests/config";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";
import { includeWorkspaceEntityTests } from "@integration-tests/helpers/includeWorkspaceEntityTests";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const workspaceId = WORKSPACE_1.id;
const baseQuery = { version: v1, workspaceId };

export const UPLOAD_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.POST,
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
      description: `returns ${HTTP.OK} when files are uploaded`,
      session: { user: { email: SUPER_USER_EMAIL } },
      attach: [
        {
          field: "some-data1.txt",
          file: Buffer.from("some data1"),
        },
        {
          field: "some-data2.txt",
          file: Buffer.from("some data2"),
        },
      ],
      expect: {
        statusCode: HTTP.OK,
      },
    });
  }
);
