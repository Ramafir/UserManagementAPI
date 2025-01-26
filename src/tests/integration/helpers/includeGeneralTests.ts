import { ITest } from "@integration-tests/probata";
import { StatusCodes as HTTP } from "http-status-codes";
import { SUPER_USER_EMAIL } from "@integration-tests/config";

export const includeGeneralTests = <T extends { version: number }>(data: {
  appendToAction?: string;
  baseQuery: T;
  addTest: <Q, B>(data: Omit<ITest<Q, B>, "method">) => void;
}) => {
  const { addTest, baseQuery, appendToAction } = data;

  addTest({
    description: `returns ${HTTP.UNAUTHORIZED} when user is not signed in`,
    appendToAction,
    query: baseQuery,
    expect: {
      statusCode: HTTP.UNAUTHORIZED,
    },
  });

  addTest({
    description: `returns ${HTTP.BAD_REQUEST} when endpoint version does not exist`,
    session: { user: { email: SUPER_USER_EMAIL } },
    appendToAction,
    query: {
      ...baseQuery,
      version: 9999999,
    },
    expect: {
      statusCode: HTTP.BAD_REQUEST,
    },
  });
};
