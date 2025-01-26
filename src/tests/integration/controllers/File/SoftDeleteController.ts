import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { addFiles } from "@integration-tests/helpers/db/addFiles";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";
import { includeWorkspaceEntityTests } from "@integration-tests/helpers/includeWorkspaceEntityTests";
import {
  WORKSPACE_1,
  SUPER_USER_EMAIL,
  DIRECTORY_ROOT,
} from "@integration-tests/config";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const workspaceId = WORKSPACE_1.id;
const baseQuery = { version: v1, workspaceId };

const FILE = {
  id: 9,
  originalFilename: "file-to-delete.ts",
  relativePath: DIRECTORY_ROOT.relativePath,
  workspaceId,
};

const appendToAction = `${FILE.id}`;

export const SOFT_DELETE_CONTROLLER_V1_BEFORE_HOOK = async () => {
  return addFiles([FILE]);
};

export const SOFT_DELETE_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.DELETE,
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
      description: `returns ${HTTP.NO_CONTENT} when file is removed`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction,
      expect: {
        statusCode: HTTP.NO_CONTENT,
      },
    });
  }
);
