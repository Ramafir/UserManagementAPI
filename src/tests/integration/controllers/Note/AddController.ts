import { faker } from "@faker-js/faker";
import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { includeTextTests } from "@integration-tests/helpers/includeTextTests";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";
import { includeWorkspaceEntityTests } from "@integration-tests/helpers/includeWorkspaceEntityTests";
import {
  FILE_1,
  WORKSPACE_1,
  SUPER_USER_EMAIL,
  UNEXISTING_ITEM_ID,
} from "@integration-tests/config";

import { NOTE_RULES } from "@shared/constants/rules";

import { BaseController } from "@controllers/BaseController";

const {
  VALUE: { MIN_LENGTH, MAX_LENGTH },
} = NOTE_RULES;
const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const workspaceId = WORKSPACE_1.id;
const baseQuery = { version: v1, workspaceId };
const baseBody = { fileId: FILE_1.id };

export const ADD_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.POST,
    baseQuery,
    baseBody,
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

    includeTextTests({
      addTest,
      field: "text",
      baseQuery,
      minLength: MIN_LENGTH,
      maxLength: MAX_LENGTH,
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when file does not exist`,
      session: { user: { email: SUPER_USER_EMAIL } },
      query: {
        ...baseQuery,
        fileId: UNEXISTING_ITEM_ID,
      },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.CREATED} on valid request`,
      session: { user: { email: SUPER_USER_EMAIL } },
      body: {
        ...baseBody,
        text: faker.lorem.words(7),
      },
      expect: {
        statusCode: HTTP.CREATED,
      },
    });
  }
);
