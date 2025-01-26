import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";

import { setYupError } from "@helpers/yup/setError";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

export const useVersionSchema: (
  versions: number[]
) => SuperSchema.Fragment<{ version: number }> = (versions: number[]) =>
  object({
    version: number()
      .required()
      .oneOf(versions, setYupError(CUSTOM_MESSAGES.GENERAL.WRONG_VERSION)),
  });
