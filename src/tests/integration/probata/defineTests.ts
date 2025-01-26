import { ICustomTest, ITest, Method } from ".";

export const defineTests = <BQ = { version: number }, BB = void>(
  general: {
    method: Method;
    baseBody?: BB;
    baseQuery: BQ;
  },
  builder: (arg: {
    addTest: <Q, B>(data: Omit<ITest<Q, B>, "method">) => void;
    addCustomTest: (
      data: Omit<ICustomTest, "method" | "query" | "body">
    ) => void | Promise<void>;
  }) => void
) => {
  const tests: (ITest | ICustomTest)[] = [];

  const { baseQuery, baseBody, method } = general;

  const addTestBuilder = <Q, B>(data: Omit<ITest<Q, B>, "method">) => {
    tests.push({
      ...data,
      method,
      query: { ...baseQuery, ...data.query },
      body: baseBody ? { ...baseBody, ...data.body } : data.body,
    });
  };

  const addCustomTestBuilder = (
    data: Omit<ICustomTest, "method" | "query" | "body">
  ) => {
    tests.push({
      ...data,
      method,
      body: baseBody,
      query: baseQuery,
    });
  };

  builder({ addTest: addTestBuilder, addCustomTest: addCustomTestBuilder });

  return tests;
};
