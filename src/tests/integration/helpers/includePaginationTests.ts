import { ITest } from "@integration-tests/probata";
import { StatusCodes as HTTP } from "http-status-codes";
import { SUPER_USER_EMAIL } from "@integration-tests/config";

export const includePaginationTests = <T extends { version: number }>(data: {
  appendToAction?: string;
  baseQuery: T;
  addTest: <Q, B>(data: Omit<ITest<Q, B>, "method">) => void;
}) => {
  const { addTest, baseQuery } = data;

  addTest({
    description: `returns ${HTTP.BAD_REQUEST} when 'page' query param is invalid`,
    query: {
      ...baseQuery,
      perPage: 10,
    },
    session: { user: { email: SUPER_USER_EMAIL } },
    expect: {
      statusCode: HTTP.BAD_REQUEST,
    },
  });

  addTest({
    description: `returns ${HTTP.BAD_REQUEST} when 'perPage' query param is invalid`,
    query: {
      ...baseQuery,
      page: 1,
    },
    session: { user: { email: SUPER_USER_EMAIL } },
    expect: {
      statusCode: HTTP.BAD_REQUEST,
    },
  });
};
