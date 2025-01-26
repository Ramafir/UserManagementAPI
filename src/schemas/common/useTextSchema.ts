import { string } from "yup";
import sanitizeHtml from "sanitize-html";

export const useTextSchema = (minLength: number, maxLength: number) =>
  string()
    .required()
    .trim()
    .transform(value => sanitizeHtml(value))
    .min(minLength)
    .max(maxLength);
