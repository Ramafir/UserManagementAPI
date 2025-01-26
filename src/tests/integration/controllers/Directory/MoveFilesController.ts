import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { addFiles } from "@integration-tests/helpers/db/addFiles";
import { addDirectories } from "@integration-tests/helpers/db/addDirectories";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";
import { includeWorkspaceEntityTests } from "@integration-tests/helpers/includeWorkspaceEntityTests";
import {
  SUPER_USER_EMAIL,
  UNEXISTING_ITEM_ID,
  WORKSPACE_1,
} from "@integration-tests/config";

import { FILES } from "@config";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const workspaceId = WORKSPACE_1.id;
const baseQuery = { version: v1 };
const workspaceQuery = { ...baseQuery, workspaceId };

const SOURCE_DIRECTORY_NAME = "src";
const TARGET_DIRECTORY_NAME = "data";

export const SOURCE_DIRECTORY = {
  id: 2,
  relativePath: `${FILES.ROOT}/${SOURCE_DIRECTORY_NAME}`,
};

export const TARGET_DIRECTORY = {
  id: 3,
  relativePath: `${FILES.ROOT}/${TARGET_DIRECTORY_NAME}`,
};

export const FILE_1 = {
  id: 2,
  relativePath: SOURCE_DIRECTORY.relativePath,
  workspaceId,
};

export const FILE_2 = {
  id: 3,
  relativePath: SOURCE_DIRECTORY.relativePath,
  workspaceId,
};

export const MOVE_FILES_CONTROLLER_V1_BEFORE_HOOK = async () => {
  await addDirectories([SOURCE_DIRECTORY, TARGET_DIRECTORY]);

  return addFiles([FILE_1, FILE_2]);
};

export const MOVE_FILES_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.POST,
    baseQuery: workspaceQuery,
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

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when source directory does not exist`,
      session: { user: { email: SUPER_USER_EMAIL } },
      body: {
        sourceDirectoryId: UNEXISTING_ITEM_ID,
        targetDirectoryId: SOURCE_DIRECTORY.id,
      },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when target directory does not exist`,
      session: { user: { email: SUPER_USER_EMAIL } },
      body: {
        sourceDirectoryId: SOURCE_DIRECTORY.id,
        targetDirectoryId: UNEXISTING_ITEM_ID,
      },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.NO_CONTENT} when '${SOURCE_DIRECTORY_NAME}' dir files are moved to '${TARGET_DIRECTORY_NAME}/${SOURCE_DIRECTORY_NAME}'`,
      session: { user: { email: SUPER_USER_EMAIL } },
      body: {
        sourceDirectoryId: SOURCE_DIRECTORY.id,
        targetDirectoryId: TARGET_DIRECTORY.id,
      },
      expect: {
        statusCode: HTTP.NO_CONTENT,
      },
    });
  }
);
