import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { addFiles } from "@integration-tests/helpers/db/addFiles";
import { addDirectories } from "@integration-tests/helpers/db/addDirectories";
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

export const EMPTY_DIRECTORY = {
  id: 7,
  relativePath: `${DIRECTORY_ROOT.relativePath}/empty`,
};

export const DIRECTORY_WITH_SAME_FILE = {
  id: 8,
  relativePath: `${DIRECTORY_ROOT.relativePath}/rtp`,
};

const FILE_1 = {
  id: 7,
  originalFilename: "test.ts",
  relativePath: DIRECTORY_ROOT.relativePath,
  workspaceId,
};

const FILE_2 = {
  id: 8,
  originalFilename: "test.ts",
  relativePath: DIRECTORY_WITH_SAME_FILE.relativePath,
  workspaceId,
};

const appendToAction = `${FILE_1.id}/relative-path`;

export const PATCH_RELATIVE_PATH_CONTROLLER_V1_BEFORE_HOOK = async () => {
  await addDirectories([EMPTY_DIRECTORY, DIRECTORY_WITH_SAME_FILE]);

  return addFiles([FILE_1, FILE_2]);
};

export const PATCH_RELATIVE_PATH_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.PATCH,
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

    // @TODO these could be moved to "includeRelativePathTests" file

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when relativePath does not match regex`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction,
      body: {
        relativePath: `$/@/1`,
      },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when relativePath includes double slash`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction,
      body: {
        relativePath: `//this//is//bad/path`,
      },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when relativePath ends with slash`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction,
      body: {
        relativePath: `${DIRECTORY_WITH_SAME_FILE.relativePath}/`,
      },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when relativePath does not start with root character`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction,
      body: {
        relativePath: `/missing/root/character`,
      },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when at provided path there is file with same filename`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction,
      body: {
        relativePath: `${DIRECTORY_WITH_SAME_FILE.relativePath}`,
      },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.NO_CONTENT} on relativePath patch`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction,
      body: {
        relativePath: EMPTY_DIRECTORY.relativePath,
      },
      expect: {
        statusCode: HTTP.NO_CONTENT,
      },
    });
  }
);
