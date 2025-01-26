import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { addUsers } from "@integration-tests/helpers/db/addUsers";
import { NO_PERMISSIONS_ROLE_ID } from "@integration-tests/config";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";

import { IUserSessionDTO } from "@shared/types/DTOs/Auth";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const DELETE_SESSION_MEMBER1_EMAIL = "session-delete-member1@email.com";
const DELETE_SESSION_MEMBER2_EMAIL = "session-delete-member2@email.com";

const baseQuery = { version: v1 };

export const DELETE_SESSION_CONTROLLER_V1_BEFORE_HOOK = async () => {
  return addUsers([
    {
      email: DELETE_SESSION_MEMBER1_EMAIL,
      isSignedUp: true,
      roleNameOrId: NO_PERMISSIONS_ROLE_ID,
    },
    {
      email: DELETE_SESSION_MEMBER2_EMAIL,
      isSignedUp: true,
      roleNameOrId: NO_PERMISSIONS_ROLE_ID,
    },
  ]);
};

export const DELETE_SESSION_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.DELETE,
    baseQuery,
  },

  ({ addTest, addCustomTest }) => {
    includeGeneralTests({
      addTest,
      baseQuery,
      appendToAction: `some-session-id-111-222`,
    });

    addCustomTest({
      description: `returns ${HTTP.BAD_REQUEST} when user wants to delete session used to fire DELETE request`,
      statusCode: HTTP.BAD_REQUEST,
      runner: async ({ testAgent, router, request }) => {
        const cookie = await testAgent.authenticate({
          email: DELETE_SESSION_MEMBER1_EMAIL,
        });

        const { action, query } = request;

        const sessionsResponse = await testAgent.customRequest({
          router,
          request: {
            method: Method.GET,
            session: { cookie },
            action,
            query,
          },
        });

        const [userSession] = <IUserSessionDTO[]>sessionsResponse.body;

        return testAgent.customRequest({
          router,
          request: {
            ...request,
            session: { cookie },
            action: `${action}/${userSession.sessionId}`,
          },
        });
      },
    });

    addCustomTest({
      description: `returns ${HTTP.NO_CONTENT} when user deletes session`,
      statusCode: HTTP.NO_CONTENT,
      runner: async ({ testAgent, router, request }) => {
        const cookie = await testAgent.authenticate({
          email: DELETE_SESSION_MEMBER2_EMAIL,
        });

        await testAgent.authenticate({
          email: DELETE_SESSION_MEMBER2_EMAIL,
        });

        const { action, query } = request;

        const sessionsResponse = await testAgent.customRequest({
          router,
          request: {
            method: Method.GET,
            session: { cookie },
            action,
            query,
          },
        });

        const sessions = <IUserSessionDTO[]>sessionsResponse.body;

        const session = sessions.find(session => !session.isRequesterSession);

        if (!session) {
          throw Error("Did not find any secondary session!!");
        }

        return testAgent.customRequest({
          router,
          request: {
            ...request,
            session: { cookie },
            action: `${action}/${session.sessionId}`,
          },
        });
      },
    });
  }
);
