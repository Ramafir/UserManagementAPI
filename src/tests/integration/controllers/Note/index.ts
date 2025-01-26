import { defineTestsGroup } from "@integration-tests/probata";

import { ADD_CONTROLLER_V1_TESTS } from "./AddController";
import { GET_ALL_CONTROLLER_V1_TESTS } from "./GetAllController";
import {
  PATCH_VALUE_CONTROLLER_V1_BEFORE_HOOK,
  PATCH_VALUE_CONTROLLER_V1_TESTS,
} from "./PatchValueController";
import {
  SOFT_DELETE_CONTROLLER_V1_TESTS,
  SOFT_DELETE_CONTROLLER_V1_BEFORE_HOOK,
} from "./SoftDeleteController";

import { BaseController } from "@controllers/BaseController";
import { AddController } from "@controllers/Note/AddController";
import { GetAllController } from "@controllers/Note/GetAllController";
import { PatchValueController } from "@controllers/Note/PatchValueController";
import { SoftDeleteController } from "@controllers/Note/SoftDeleteController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const NOTE_TESTS = defineTestsGroup({
  name: "Note",
  router: `notes`,
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
      controller: SoftDeleteController.name,
      testData: [
        {
          routerVersion: v1,
          tests: SOFT_DELETE_CONTROLLER_V1_TESTS,
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
      controller: PatchValueController.name,
      testData: [
        {
          routerVersion: v1,
          tests: PATCH_VALUE_CONTROLLER_V1_TESTS,
        },
      ],
    },
  ],
  hooks: {
    before: function () {
      return Promise.all([
        SOFT_DELETE_CONTROLLER_V1_BEFORE_HOOK(),
        PATCH_VALUE_CONTROLLER_V1_BEFORE_HOOK(),
      ]);
    },
  },
});
