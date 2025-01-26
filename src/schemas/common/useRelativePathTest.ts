import { string } from "yup";

import { FILES } from "@config";

import { setYupError } from "@helpers/yup/setError";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

export const useRelativePathTest = () =>
  string()
    .trim()
    .required()
    .matches(/^[a-zA-Z0-9/._-]+$/)
    .test((value: string, ctx) => {
      // @NOTE we could consider implementing single regex to cover all :thinking:

      if (value.includes("//")) {
        return ctx.createError({
          message: "Double slash is forbidden.",
        });
      }

      if (value.endsWith("/")) {
        return ctx.createError({
          message: setYupError(
            CUSTOM_MESSAGES.GENERAL.SHOULD_NOT_END_WITH,
            "/ (slash)"
          ),
        });
      }

      if (!value.startsWith(FILES.ROOT)) {
        return ctx.createError({
          message: setYupError(
            CUSTOM_MESSAGES.FILE.SHOULD_START_WITH_ROOT_INDICATOR
          ),
        });
      }

      if (value.split(FILES.ROOT).length > 2) {
        return ctx.createError({
          message: setYupError(CUSTOM_MESSAGES.FILE.ONLY_ONE_ROOT_INDICATOR),
        });
      }

      return true;
    });
