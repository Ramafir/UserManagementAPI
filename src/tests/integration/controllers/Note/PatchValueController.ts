import { faker } from "@faker-js/faker";
import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { addNotes } from "@integration-tests/helpers/db/addNotes";
import { includeTextTests } from "@integration-tests/helpers/includeTextTests";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";
import { includeWorkspaceEntityTests } from "@integration-tests/helpers/includeWorkspaceEntityTests";
import {
  FILE_1,
  WORKSPACE_1,
  SUPER_USER_EMAIL,
  UNEXISTING_ITEM_ID,
  USER_WITH_ACCESS_TO_WORKSPACE_1,
} from "@integration-tests/config";

import { NOTE_RULES } from "@shared/constants/rules";

import { BaseController } from "@controllers/BaseController";

const {
  VALUE: { MIN_LENGTH, MAX_LENGTH },
} = NOTE_RULES;
const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const workspaceId = WORKSPACE_1.id;
const baseQuery = { version: v1, workspaceId };
const baseBody = {
  text: faker.lorem.words(10),
};

const NOTE_TO_UPDATE_1 = {
  id: 2,
  value: "note to update",
  fileId: FILE_1.id,
  workspaceId,
};

const NOTE_TO_UPDATE_2 = {
  id: 3,
  value: "note to update2",
  fileId: FILE_1.id,
  workspaceId,
  email: USER_WITH_ACCESS_TO_WORKSPACE_1,
};

const note1AppendToAction = `${NOTE_TO_UPDATE_1.id}/value`;
const note2AppendToAction = `${NOTE_TO_UPDATE_2.id}/value`;

export const PATCH_VALUE_CONTROLLER_V1_BEFORE_HOOK = () => {
  return addNotes([NOTE_TO_UPDATE_1, NOTE_TO_UPDATE_2]);
};

export const PATCH_VALUE_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.PATCH,
    baseQuery,
  },

  ({ addTest }) => {
    includeGeneralTests({
      addTest,
      baseQuery,
      appendToAction: note1AppendToAction,
    });

    includeWorkspaceEntityTests({
      addTest,
      baseQuery,
      appendToAction: note1AppendToAction,
    });

    includeTextTests({
      addTest,
      baseQuery,
      field: "text",
      minLength: MIN_LENGTH,
      maxLength: MAX_LENGTH,
      appendToAction: note1AppendToAction,
    });

    addTest({
      description: `returns ${HTTP.NOT_FOUND} when note does not exist`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction: `${UNEXISTING_ITEM_ID}/value`,
      body: baseBody,
      expect: {
        statusCode: HTTP.NOT_FOUND,
      },
    });

    addTest({
      description: `returns ${HTTP.NOT_FOUND} when attempting to update unowned note (and without update any permission)`,
      session: { user: { email: USER_WITH_ACCESS_TO_WORKSPACE_1 } },
      appendToAction: note1AppendToAction,
      body: baseBody,
      expect: {
        statusCode: HTTP.NOT_FOUND,
      },
    });

    addTest({
      description: `returns ${HTTP.NO_CONTENT} when updating own note`,
      session: { user: { email: USER_WITH_ACCESS_TO_WORKSPACE_1 } },
      appendToAction: note2AppendToAction,
      body: baseBody,
      expect: {
        statusCode: HTTP.NO_CONTENT,
      },
    });

    addTest({
      description: `returns ${HTTP.NO_CONTENT} when updating different user note (UpdateAny permission)`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction: note2AppendToAction,
      body: baseBody,
      expect: {
        statusCode: HTTP.NO_CONTENT,
      },
    });
  }
);
