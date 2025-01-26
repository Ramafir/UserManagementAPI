import { defineTestsGroup } from "@integration-tests/probata";

import { UPLOAD_CONTROLLER_V1_TESTS } from "./UploadController";
import { GET_ALL_CONTROLLER_V1_TESTS } from "./GetAllController";
import {
  GET_BY_ID_CONTROLLER_V1_TESTS,
  GET_BY_ID_CONTROLLER_V1_BEFORE_HOOK,
} from "./GetByIdController";
import {
  SOFT_DELETE_CONTROLLER_V1_BEFORE_HOOK,
  SOFT_DELETE_CONTROLLER_V1_TESTS,
} from "./SoftDeleteController";
import {
  PATCH_FILENAME_CONTROLLER_V1_BEFORE_HOOK,
  PATCH_FILENAME_CONTROLLER_V1_TESTS,
} from "./PatchFilenameController";
import {
  PATCH_RELATIVE_PATH_CONTROLLER_V1_BEFORE_HOOK,
  PATCH_RELATIVE_PATH_CONTROLLER_V1_TESTS,
} from "./PatchRelativePathController";

import { BaseController } from "@controllers/BaseController";
import { UploadController } from "@controllers/File/UploadController";
import { GetAllController } from "@controllers/File/GetAllController";
import { GetByIdController } from "@controllers/File/GetByIdController";
import { SoftDeleteController } from "@controllers/File/SoftDeleteController";
import { PatchFilenameController } from "@controllers/File/PatchFilenameController";
import { PatchRelativePathController } from "@controllers/File/PatchRelativePathController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const FILE_TESTS = defineTestsGroup({
  name: "File",
  router: `files`,
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
      controller: GetByIdController.name,
      testData: [
        {
          routerVersion: v1,
          tests: GET_BY_ID_CONTROLLER_V1_TESTS,
        },
      ],
    },
    {
      action: "",
      controller: PatchFilenameController.name,
      testData: [
        {
          routerVersion: v1,
          tests: PATCH_FILENAME_CONTROLLER_V1_TESTS,
        },
      ],
    },
    {
      action: "",
      controller: PatchRelativePathController.name,
      testData: [
        {
          routerVersion: v1,
          tests: PATCH_RELATIVE_PATH_CONTROLLER_V1_TESTS,
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
      controller: UploadController.name,
      testData: [
        {
          routerVersion: v1,
          tests: UPLOAD_CONTROLLER_V1_TESTS,
        },
      ],
    },
  ],
  hooks: {
    before: function () {
      return Promise.all([
        GET_BY_ID_CONTROLLER_V1_BEFORE_HOOK(),
        PATCH_FILENAME_CONTROLLER_V1_BEFORE_HOOK(),
        PATCH_RELATIVE_PATH_CONTROLLER_V1_BEFORE_HOOK(),
        SOFT_DELETE_CONTROLLER_V1_BEFORE_HOOK(),
      ]);
    },
  },
});
