import { faker } from "@faker-js/faker";
import { ITest } from "@integration-tests/probata";
import { StatusCodes as HTTP } from "http-status-codes";
import { BLUEPRINT_1, SUPER_USER_EMAIL } from "@integration-tests/config";

import { BLUEPRINT_RULES } from "@shared/constants/rules";

const body = {
  name: "unique-blueprint1",
  description: faker.random.alpha({
    count: BLUEPRINT_RULES.DESCRIPTION.MIN_LENGTH,
  }),
  color: "#471471",
};

export const includeAddUpdateTests = (arg: {
  baseQuery: any;
  addTest: <Q, B>(data: Omit<ITest<Q, B>, "method">) => void;
  blueprintId?: number;
}) => {
  const { baseQuery, addTest, blueprintId } = arg;

  const appendToAction = blueprintId ? `${blueprintId}` : undefined;

  addTest({
    description: `returns ${HTTP.BAD_REQUEST} when name is not unique`,
    session: { user: { email: SUPER_USER_EMAIL } },
    appendToAction,
    query: baseQuery,
    body: {
      ...body,
      name: BLUEPRINT_1.name,
    },
    expect: {
      statusCode: HTTP.BAD_REQUEST,
    },
  });

  addTest({
    description: `returns ${HTTP.BAD_REQUEST} when description is not valid`,
    session: { user: { email: SUPER_USER_EMAIL } },
    appendToAction,
    query: baseQuery,
    body: {
      ...body,
      description: "A",
    },
    expect: {
      statusCode: HTTP.BAD_REQUEST,
    },
  });

  addTest({
    description: `returns ${HTTP.BAD_REQUEST} when color is not in hexadecimal format`,
    session: { user: { email: SUPER_USER_EMAIL } },
    appendToAction,
    query: baseQuery,
    body: {
      ...body,
      color: "(71,20,113)",
    },
    expect: {
      statusCode: HTTP.BAD_REQUEST,
    },
  });

  addTest({
    description: `returns ${HTTP.BAD_REQUEST} when color is not unique`,
    session: { user: { email: SUPER_USER_EMAIL } },
    appendToAction,
    query: baseQuery,
    body: {
      ...body,
      color: BLUEPRINT_1.color,
    },
    expect: {
      statusCode: HTTP.BAD_REQUEST,
    },
  });

  return { validBody: body };
};
