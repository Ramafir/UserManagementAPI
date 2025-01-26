import { faker } from "@faker-js/faker";
import { ITest } from "@integration-tests/probata";
import { StatusCodes as HTTP } from "http-status-codes";
import { SUPER_USER_EMAIL } from "@integration-tests/config";

export const includeTextTests = (arg: {
  field: string;
  baseQuery: any;
  addTest: <Q, B>(data: Omit<ITest<Q, B>, "method">) => void;
  appendToAction?: string;
  minLength: number;
  maxLength: number;
}) => {
  const { field, baseQuery, addTest, appendToAction, minLength, maxLength } =
    arg;

  addTest({
    description: `returns ${HTTP.BAD_REQUEST} when ${field} is missing`,
    session: { user: { email: SUPER_USER_EMAIL } },
    appendToAction,
    query: baseQuery,
    body: {},
    expect: {
      statusCode: HTTP.BAD_REQUEST,
    },
  });

  addTest({
    description: `returns ${HTTP.BAD_REQUEST} when text has only spaces`,
    session: { user: { email: SUPER_USER_EMAIL } },
    appendToAction,
    query: baseQuery,
    body: {
      [field]: "                   ",
    },
    expect: {
      statusCode: HTTP.BAD_REQUEST,
    },
  });

  addTest({
    description: `returns ${HTTP.BAD_REQUEST} when text is too small (<${minLength})`,
    session: { user: { email: SUPER_USER_EMAIL } },
    appendToAction,
    query: baseQuery,
    body: {
      [field]: faker.random.alpha({ count: minLength - 1 }),
    },
    expect: {
      statusCode: HTTP.BAD_REQUEST,
    },
  });

  addTest({
    description: `returns ${HTTP.BAD_REQUEST} when text is too long (>${maxLength})`,
    session: { user: { email: SUPER_USER_EMAIL } },
    appendToAction,
    query: baseQuery,
    body: {
      [field]: faker.random.alpha({ count: maxLength + 1 }),
    },
    expect: {
      statusCode: HTTP.BAD_REQUEST,
    },
  });
};
