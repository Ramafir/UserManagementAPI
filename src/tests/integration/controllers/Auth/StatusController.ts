import { StatusCodes as HTTP } from "http-status-codes";
import { IUserService } from "types/services/IUserService";
import { Method, defineTests } from "@integration-tests/probata";
import { addUsers } from "@integration-tests/helpers/db/addUsers";
import { IUserRepository } from "types/repositories/IUserRepository";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";
import {
  NO_PERMISSIONS_ROLE_ID,
  SUPER_USER_EMAIL,
} from "@integration-tests/config";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const STATUS_MEMBER_EMAIL = "sign-out@email.com";

const baseQuery = { version: v1 };

export const STATUS_CONTROLLER_V1_BEFORE_HOOK = async () => {
  return addUsers([
    {
      email: STATUS_MEMBER_EMAIL,
      isSignedUp: true,
      roleNameOrId: NO_PERMISSIONS_ROLE_ID,
    },
  ]);
};

export const STATUS_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.GET,
    baseQuery,
  },

  ({ addTest, addCustomTest }) => {
    includeGeneralTests({
      addTest,
      baseQuery,
    });

    addCustomTest({
      description: `returns ${HTTP.UNAUTHORIZED} when user is signed in but account was deactivated`,
      statusCode: HTTP.UNAUTHORIZED,
      runner: async ({ testAgent }) => {
        const userRepository = getInstanceOf<IUserRepository>(
          Di.UserRepository
        );
        const userService = getInstanceOf<IUserService>(Di.UserService);

        const user = await userRepository.findByEmail(STATUS_MEMBER_EMAIL);

        if (!user) {
          throw Error(
            `User ${STATUS_MEMBER_EMAIL} should be created in order to run this test!`
          );
        }

        const cookie = await testAgent.authenticate({
          email: STATUS_MEMBER_EMAIL,
        });

        await userService.updateMany([
          { id: user.id, data: { isActive: false } },
        ]);

        return testAgent.request({ session: { cookie } });
      },
    });

    addTest({
      description: `returns ${HTTP.OK} when user is signed in`,
      session: {
        user: { email: SUPER_USER_EMAIL },
      },
      expect: {
        statusCode: HTTP.OK,
      },
    });
  }
);
