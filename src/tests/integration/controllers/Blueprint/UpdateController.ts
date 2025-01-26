import { expect } from "chai";
import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { IBlueprintRepository } from "types/repositories/IBlueprintRepository";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";
import { includeWorkspaceEntityTests } from "@integration-tests/helpers/includeWorkspaceEntityTests";
import {
  BLUEPRINT_1,
  WORKSPACE_1,
  SUPER_USER_EMAIL,
  UNEXISTING_ITEM_ID,
} from "@integration-tests/config";

import { includeAddUpdateTests } from "./includeAddUpdateTests";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const baseQuery = { version: v1 };
const workspaceQuery = { ...baseQuery, workspaceId: WORKSPACE_1.id };

export const UPDATE_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.PUT,
    baseQuery,
  },

  ({ addTest }) => {
    includeGeneralTests({
      addTest,
      baseQuery: workspaceQuery,
      appendToAction: `${BLUEPRINT_1.id}`,
    });

    includeWorkspaceEntityTests({
      addTest,
      baseQuery: workspaceQuery,
      appendToAction: `${BLUEPRINT_1.id}`,
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when blueprint does not exist`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction: `${UNEXISTING_ITEM_ID}`,
      query: workspaceQuery,
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    includeAddUpdateTests({
      addTest,
      baseQuery: workspaceQuery,
      blueprintId: BLUEPRINT_1.id,
    });

    addTest({
      description: `returns ${HTTP.NO_CONTENT} when blueprint is updated`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction: `${BLUEPRINT_1.id}`,
      query: workspaceQuery,
      body: {
        name: BLUEPRINT_1.name,
        description: BLUEPRINT_1.description,
        color: "#FF1493",
      },
      expect: {
        statusCode: HTTP.NO_CONTENT,
        callback: async () => {
          const blueprintRepository = getInstanceOf<IBlueprintRepository>(
            Di.BlueprintRepository
          );

          const blueprint = await blueprintRepository.getById(BLUEPRINT_1.id);

          expect(blueprint?.color).to.equal("#FF1493");
        },
      },
    });
  }
);
