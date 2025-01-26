import path from "path";

import { FILES } from "@config";

import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

export const TESTS_TIMEOUT = "10s";
export const RUNTIME_DATA_DI_TOKEN = "IRuntimeData";
export const PATH_TO_CONTROLLERS_TESTS = path.join(__dirname, "controllers");

export const SUPER_USER_EMAIL = "all-permissions@itvault.com";
export const USER_EMAIL = "no-permissions@itvault.com";
export const USER_WITH_ACCESS_TO_WORKSPACE_1 =
  "no-permissions-workspace-1@itvault.com";

export const PASSWORD = "1234";

export const ALL_PERMISSIONS_ROLE_ID = HEAD_ADMIN_ROLE.id;
export const NO_PERMISSIONS_ROLE_ID = 2;

export const ROUTER_VERSION_PREFIX = "v";

export const DIRECTORY_ROOT = {
  id: 1,
  relativePath: `${FILES.ROOT}`,
};

export const WORKSPACE_1 = {
  id: 1,
  name: "Workspace1",
  description: "This is description of Workspace1",
};

export const WORKSPACE_2 = {
  id: 2,
  name: "Workspace2",
  description: "This is description of Workspace2",
};

export const FILE_1 = {
  id: 1,
  originalFilename: "global-file.txt",
  relativePath: DIRECTORY_ROOT.relativePath,
  workspaceId: WORKSPACE_1.id,
};

export const BLUEPRINT_1 = {
  id: 1,
  name: "This is blueprint1",
  color: "#B0B0B2",
  description: "Blueprint1 description is quite typical.",
  workspaceId: WORKSPACE_1.id,
};

export const BLUEPRINT_2 = {
  id: 2,
  name: "This is blueprint2",
  color: "#E2FD07",
  description: "Blueprint2 description is quite typical.",
  workspaceId: WORKSPACE_1.id,
};

export const UNEXISTING_ITEM_ID = 9999;
