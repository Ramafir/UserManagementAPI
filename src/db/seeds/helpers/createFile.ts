import path from "path";
import fs from "fs-extra";
import random from "lodash/random";
import { faker } from "@faker-js/faker";

export async function createFile(
  filename: string,
  extension: string,
  uploadDir: string
) {
  await fs.ensureDir(uploadDir);

  const fileDir = path.join(uploadDir, filename);

  const fileContent = getFileContent(extension);

  await fs.writeFile(path.join(uploadDir, filename), fileContent);

  const fileStats = await fs.stat(fileDir);

  return fileStats.size;
}

function getFileContent(extension: string) {
  const linesAmount = random(10, 40);

  const rawContent = [];
  let wasLineBreakRecentlyAdded = false;

  const caller =
    extension === "js" ? faker.hacker.phrase : faker.word.adjective;

  for (let index = 0; index < linesAmount; index++) {
    rawContent.push(caller());

    const includeLineBreak = random(0, 3000);

    if (includeLineBreak < 1000 || includeLineBreak > 2000) {
      continue;
    }

    if (wasLineBreakRecentlyAdded) {
      wasLineBreakRecentlyAdded = false;

      continue;
    }

    rawContent.push("");
    wasLineBreakRecentlyAdded = true;
  }

  return rawContent.join("\n");
}
