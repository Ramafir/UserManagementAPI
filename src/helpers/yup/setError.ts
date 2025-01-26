import { sprintf } from "sprintf-js";

export const setYupError = (
  error: string,
  ...replacements: (string | number)[]
) => {
  return sprintf(error, ...replacements);
};
