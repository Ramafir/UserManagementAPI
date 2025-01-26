import path from "path";
import fs from "fs-extra";

import { APP } from "@config/index";

import { Dependency } from "@enums/Dependency";

import "@helpers/yup/internal-messages";

export const loadYupCustomMethods = async () => {
  const dir = path.join(APP.BASE_DIR, "helpers", "yup", "custom-methods");

  log.debug({
    dependency: Dependency.yup,
    message: "Loading custom methods...",
  });

  fs.readdir(dir, async (error, files) => {
    for (const file of files) {
      await import(`@helpers/yup/custom-methods/${file}`);
    }
  });
};
