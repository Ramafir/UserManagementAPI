import { defineTestsGroup } from "@integration-tests/probata";

import {
  ADD_CONTROLLER_V1_BEFORE_HOOK,
  ADD_CONTROLLER_V1_TESTS,
} from "./AddController";
import {
  GET_ALL_CONTROLLER_V1_BEFORE_HOOK,
  GET_ALL_CONTROLLER_V1_TESTS,
} from "./GetAllController";
import {
  HARD_DELETE_CONTROLLER_V1_TESTS,
  HARD_DELETE_CONTROLLER_V1_BEFORE_HOOK,
} from "./HardDeleteController";
import {
  PATCH_VALUE_CONTROLLER_V1_BEFORE_HOOK,
  PATCH_VALUE_CONTROLLER_V1_TESTS,
} from "./PatchValueController";

import { BaseController } from "@controllers/BaseController";
import { AddController } from "@controllers/ChatMessage/AddController";
import { GetAllController } from "@controllers/ChatMessage/GetAllController";
import { HardDeleteController } from "@controllers/ChatMessage/HardDeleteController";
import { PatchValueController } from "@controllers/ChatMessage/PatchValueController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const CHAT_MESSAGE_TESTS = defineTestsGroup({
  name: "ChatMessage",
  router: `chat-messages`,
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
      controller: HardDeleteController.name,
      testData: [
        {
          routerVersion: v1,
          tests: HARD_DELETE_CONTROLLER_V1_TESTS,
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
  ],
  hooks: {
    before: () => {
      return Promise.all([
        GET_ALL_CONTROLLER_V1_BEFORE_HOOK(),
        HARD_DELETE_CONTROLLER_V1_BEFORE_HOOK(),
        PATCH_VALUE_CONTROLLER_V1_BEFORE_HOOK(),
        ADD_CONTROLLER_V1_BEFORE_HOOK(),
      ]);
    },
  },
});
