import formidable from "formidable";
import { IFormDataFile } from "types/IFormDataFile";

export const mapFormDataFiles = (files: formidable.Files): IFormDataFile[] => {
  const result = [];

  for (const [relativePath, value] of Object.entries(files)) {
    const arrayOfFiles = Array.isArray(value) ? value : [value];

    for (const file of arrayOfFiles) {
      result.push({
        relativePath,
        value: file,
      });
    }
  }

  return result;
};
