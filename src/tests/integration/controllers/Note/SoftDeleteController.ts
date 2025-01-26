import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { addNotes } from "@integration-tests/helpers/db/addNotes";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";
import { includeWorkspaceEntityTests } from "@integration-tests/helpers/includeWorkspaceEntityTests";
import {
  FILE_1,
  SUPER_USER_EMAIL,
  USER_WITH_ACCESS_TO_WORKSPACE_1,
  WORKSPACE_1,
} from "@integration-tests/config";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const workspaceId = WORKSPACE_1.id;
const baseQuery = { version: v1, workspaceId };

const NOTE = {
  id: 1,
  fileId: FILE_1.id,
  workspaceId,
};

const appendToAction = `${NOTE.id}`;

export const SOFT_DELETE_CONTROLLER_V1_BEFORE_HOOK = () => {
  return addNotes([NOTE]);
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
      description: `returns ${HTTP.FORBIDDEN} when attempting to remove unowned note (and without permission to remove any)`,
      session: { user: { email: USER_WITH_ACCESS_TO_WORKSPACE_1 } },
      appendToAction,
      expect: {
        statusCode: HTTP.FORBIDDEN,
      },
    });

    addTest({
      description: `returns ${HTTP.NO_CONTENT} when note is removed`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction,
      expect: {
        statusCode: HTTP.NO_CONTENT,
      },
    });
  }
);
