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

import { FILE_RULES } from "@shared/constants/rules";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const workspaceId = WORKSPACE_1.id;
const baseQuery = { version: v1, workspaceId };

const FILE_1 = {
  id: 5,
  relativePath: DIRECTORY_ROOT.relativePath,
  workspaceId,
};

const FILE_2 = {
  id: 6,
  originalFilename: "super_file.txt",
  relativePath: DIRECTORY_ROOT.relativePath,
  workspaceId,
};

const appendToAction = `${FILE_1.id}/filename`;

export const PATCH_FILENAME_CONTROLLER_V1_BEFORE_HOOK = async () => {
  return addFiles([FILE_1, FILE_2]);
};

export const PATCH_FILENAME_CONTROLLER_V1_TESTS = defineTests(
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

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when filename not matches ${FILE_RULES.FILENAME.REGEX} regex`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction,
      body: {
        filename: "file1:txt",
      },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when there is already file with similiar name`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction,
      body: {
        filename: "super_file.txt",
      },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.NO_CONTENT} on filename patch`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction,
      body: {
        filename: "this_filename_should_be_accepted.txt",
      },
      expect: {
        statusCode: HTTP.NO_CONTENT,
      },
    });
  }
);
