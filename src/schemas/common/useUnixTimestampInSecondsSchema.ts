import { number } from "yup";

import { setYupError } from "@helpers/yup/setError";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

const UNIX_TIMESTAMP_IN_SECONDS_LENGTH = 10;

export const useUnixTimestampInSecondsSchema = () =>
  number()
    .required()
    .test((value, ctx) => {
      const valueAsString = value.toString();

      if (valueAsString.length !== UNIX_TIMESTAMP_IN_SECONDS_LENGTH) {
        return ctx.createError({
          message: setYupError(
            CUSTOM_MESSAGES.DATE.NOT_UNIX_TIMESTAMP_IN_SECONDS
          ),
        });
      }

      return true;
    });
