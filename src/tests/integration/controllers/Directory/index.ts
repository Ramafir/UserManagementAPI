import { defineTestsGroup } from "@integration-tests/probata";

import {
  MOVE_FILES_CONTROLLER_V1_TESTS,
  MOVE_FILES_CONTROLLER_V1_BEFORE_HOOK,
} from "./MoveFilesController";

import { BaseController } from "@controllers/BaseController";
import { MoveFilesController } from "@controllers/Directory/MoveFilesController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const DIRECTORY_TESTS = defineTestsGroup({
  name: "Directory",
  router: `directories`,
  collection: [
    {
      action: "move-files",
      controller: MoveFilesController.name,
      testData: [
        {
          routerVersion: v1,
          tests: MOVE_FILES_CONTROLLER_V1_TESTS,
        },
      ],
    },
  ],
  hooks: {
    before: function () {
      return Promise.all([MOVE_FILES_CONTROLLER_V1_BEFORE_HOOK()]);
    },
  },
});
