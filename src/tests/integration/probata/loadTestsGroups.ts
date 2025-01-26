import fs from "fs-extra";
import snakeCase from "lodash/snakeCase";

import { ITestsGroup } from "./types";

export const loadTestsGroups = async (suite: Mocha.Suite, dir: string) => {
  let testsCount = 0;
  const unprivilegedTestsGroups: ITestsGroup[] = [];
  const privilegedTestsGroups: ITestsGroup[] = [];

  const dirContent = fs.readdirSync(dir);

  for (const dirElement of dirContent) {
    if (dirElement.includes(".")) {
      throw Error(
        `'${dir}' should only include dirs but found ${dirElement}!!`
      );
    }

    const module = await import(`${dir}/${dirElement}`);
    const value = `${snakeCase(dirElement).toUpperCase()}_TESTS`;

    const testsGroup: ITestsGroup = module[value];

    if (!testsGroup) {
      continue;
    }

    testsGroup._data.runInPrivilegedMode
      ? privilegedTestsGroups.push(testsGroup)
      : unprivilegedTestsGroups.push(testsGroup);
  }

  const testsGroups: ITestsGroup[] = privilegedTestsGroups.length
    ? privilegedTestsGroups
    : [...privilegedTestsGroups, ...unprivilegedTestsGroups];

  for (const testsGroup of testsGroups) {
    testsCount += testsGroup.loadToSuite(suite);
  }

  suite.title = `Integration tests (${testsCount})`;

  return testsGroups;
};
