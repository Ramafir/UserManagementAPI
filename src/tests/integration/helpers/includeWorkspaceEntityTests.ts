import { ITest } from "@integration-tests/probata";
import { StatusCodes as HTTP } from "http-status-codes";
import { UNEXISTING_ITEM_ID, USER_EMAIL } from "@integration-tests/config";

const defaultFlags = {
  workspaceIdNotProvidedTest: true,
  notPermittedToViewWorkspaceTest: true,
  workspaceNotAvailableTest: true,
};

export const includeWorkspaceEntityTests = (
  data: {
    baseQuery: any;
    appendToAction?: string;
    addTest: <Q, B>(data: Omit<ITest<Q, B>, "method">) => void;
  },
  flags?: {
    workspaceIdNotProvidedTest?: boolean;
    notPermittedToViewWorkspaceTest?: boolean;
    workspaceNotAvailableTest?: boolean;
  }
) => {
  const { addTest, baseQuery, appendToAction } = data;

  const currentFlags = flags || defaultFlags;

  if (currentFlags.workspaceIdNotProvidedTest) {
    addTest({
      description: `returns ${HTTP.FORBIDDEN} when 'workspaceId' query param is not provided`,
      session: { user: { email: USER_EMAIL } },
      appendToAction,
      expect: {
        statusCode: HTTP.FORBIDDEN,
      },
    });
  }

  if (currentFlags.notPermittedToViewWorkspaceTest) {
    addTest({
      description: `returns ${HTTP.FORBIDDEN} when user is not permitted to access workspace related endpoint`,
      query: baseQuery,
      session: { user: { email: USER_EMAIL } },
      appendToAction,
      expect: {
        statusCode: HTTP.FORBIDDEN,
      },
    });
  }

  if (currentFlags.workspaceNotAvailableTest) {
    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when workspace does not exist`,
      query: {
        ...baseQuery,
        workspaceId: UNEXISTING_ITEM_ID,
      },
      session: { user: { email: USER_EMAIL } },
      appendToAction,
      expect: {
        statusCode: HTTP.FORBIDDEN,
      },
    });
  }
};
