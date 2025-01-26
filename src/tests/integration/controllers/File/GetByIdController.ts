import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { addFiles } from "@integration-tests/helpers/db/addFiles";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";
import { includeWorkspaceEntityTests } from "@integration-tests/helpers/includeWorkspaceEntityTests";
import {
  WORKSPACE_1,
  SUPER_USER_EMAIL,
  DIRECTORY_ROOT,
  UNEXISTING_ITEM_ID,
} from "@integration-tests/config";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const workspaceId = WORKSPACE_1.id;
const baseQuery = { version: v1, workspaceId };

const FILE = {
  id: 4,
  relativePath: DIRECTORY_ROOT.relativePath,
  workspaceId,
};

const appendToAction = `${FILE.id}`;

export const GET_BY_ID_CONTROLLER_V1_BEFORE_HOOK = async () => {
  return addFiles([FILE]);
};

export const GET_BY_ID_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.GET,
    baseQuery,
  },

  ({ addTest }) => {
    includeGeneralTests({
      addTest,
      baseQuery,
      appendToAction,
    });

    includeWorkspaceEntityTests({
      addTest,
      baseQuery,
      appendToAction,
    });

    addTest({
      description: `returns ${HTTP.NOT_FOUND} when requested file is not available`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction: `${UNEXISTING_ITEM_ID}`,
      expect: {
        statusCode: HTTP.NOT_FOUND,
      },
    });

    addTest({
      description: `returns ${HTTP.OK} on file request`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction,
      expect: {
        statusCode: HTTP.OK,
      },
    });
  }
);
