import "reflect-metadata";
import { Server } from "http";
import { container } from "tsyringe";
import Redis from "ioredis/built/Redis";
import { server, onExit } from "../../server";

import { APP } from "@config";

import { addFiles } from "./helpers/db/addFiles";
import { addUsers } from "./helpers/db/addUsers";
import { RuntimeData } from "./helpers/RuntimeData";
import { IRuntimeData } from "./types/IRuntimeData";
import { addBlueprints } from "./helpers/db/addBlueprints";
import { addWorkspaces } from "./helpers/db/addWorkspaces";
import { addDirectories } from "./helpers/db/addDirectories";
import { ITestsGroup, loadTestsGroups, useTestAgent } from "./probata";
import { setUserWorkspacesAccess } from "./helpers/db/setUserWorkspacesAccess";
import {
  TESTS_TIMEOUT,
  RUNTIME_DATA_DI_TOKEN,
  PATH_TO_CONTROLLERS_TESTS,
  WORKSPACE_1,
  WORKSPACE_2,
  BLUEPRINT_1,
  BLUEPRINT_2,
  DIRECTORY_ROOT,
  FILE_1,
  USER_WITH_ACCESS_TO_WORKSPACE_1,
  NO_PERMISSIONS_ROLE_ID,
} from "./config";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

const { PORT } = APP;
let TESTS_GROUPS: ITestsGroup[];

describe("Integration tests", async function () {
  this.timeout(TESTS_TIMEOUT);

  before(done => {
    server().then(app => {
      app.listen(PORT, async () => {
        await prepare(this, app);

        done();
      });
    });
  });

  TESTS_GROUPS = await loadTestsGroups(this, PATH_TO_CONTROLLERS_TESTS);

  after(function (done) {
    this.timeout(TESTS_TIMEOUT);

    const redis = getInstanceOf<Redis>(Di.Redis);
    redis.flushall();

    const { app } = getInstanceOf<IRuntimeData>(
      RUNTIME_DATA_DI_TOKEN
    ).getData();

    app.close(async () => {
      await onExit();

      done();
    });
  });
});

async function prepare(suite: Mocha.Suite, app: Server) {
  await addWorkspaces([WORKSPACE_1, WORKSPACE_2]);

  await addBlueprints([BLUEPRINT_1, BLUEPRINT_2]);

  await addUsers([
    {
      email: USER_WITH_ACCESS_TO_WORKSPACE_1,
      isSignedUp: true,
      roleNameOrId: NO_PERMISSIONS_ROLE_ID,
    },
  ]);

  await setUserWorkspacesAccess({
    email: USER_WITH_ACCESS_TO_WORKSPACE_1,
    workspaceIds: [WORKSPACE_1.id],
  });

  await addDirectories([DIRECTORY_ROOT]);

  await addFiles([FILE_1]);

  for (const testsGroup of TESTS_GROUPS) {
    testsGroup.beforeAll(suite);
  }

  const runtimeData = new RuntimeData(app);

  await addGlobalCookies(runtimeData);

  container.register(RUNTIME_DATA_DI_TOKEN, { useValue: runtimeData });
}

async function addGlobalCookies(runtimeData: IRuntimeData) {
  const { globalCookie, supertest } = runtimeData.getData();
  const testAgent = useTestAgent(supertest);

  const emails = Object.keys(globalCookie);
  const { length } = emails;

  const cookies = await Promise.all(
    emails.map(email => testAgent.authenticate({ email }))
  );

  for (let index = 0; index < length; index++) {
    runtimeData.addGlobalCookie({
      email: emails[index],
      cookie: cookies[index],
    });
  }
}
