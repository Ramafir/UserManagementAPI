import formidable from "formidable";

export interface IFormDataFile {
  relativePath: string;

  value: formidable.File;
}
