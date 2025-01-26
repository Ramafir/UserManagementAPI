import { defineTestsGroup } from "@integration-tests/probata";

import { ADD_CONTROLLER_V1_TESTS } from "./AddController";
import { UPDATE_CONTROLLER_V1_TESTS } from "./UpdateController";
import { GET_ALL_CONTROLLER_V1_TESTS } from "./GetAllController";
import {
  SOFT_DELETE_CONTROLLER_V1_BEFORE_HOOK,
  SOFT_DELETE_CONTROLLER_V1_TESTS,
} from "./SoftDeleteController";

import { BaseController } from "@controllers/BaseController";
import { AddController } from "@controllers/Blueprint/AddController";
import { SoftDeleteController } from "@controllers/SoftDeleteController";
import { GetAllController } from "@controllers/Blueprint/GetAllController";
import { UpdateController } from "@controllers/Blueprint/UpdateController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const BLUEPRINT_TESTS = defineTestsGroup({
  name: "Blueprint",
  router: `blueprints`,
  collection: [
    {
      action: "",
      controller: GetAllController.name,
      testData: [
        {
          routerVersion: v1,
          tests: GET_ALL_CONTROLLER_V1_TESTS,
        },
      ],
    },
    {
      action: "",
      controller: AddController.name,
      testData: [
        {
          routerVersion: v1,
          tests: ADD_CONTROLLER_V1_TESTS,
        },
      ],
    },
    {
      action: "",
      controller: UpdateController.name,
      testData: [
        {
          routerVersion: v1,
          tests: UPDATE_CONTROLLER_V1_TESTS,
        },
      ],
    },
    {
      action: "",
      controller: SoftDeleteController.name,
      testData: [
        {
          routerVersion: v1,
          tests: SOFT_DELETE_CONTROLLER_V1_TESTS,
        },
      ],
    },
  ],
  hooks: {
    before: () => {
      return Promise.all([SOFT_DELETE_CONTROLLER_V1_BEFORE_HOOK()]);
    },
  },
});
