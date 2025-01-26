import { number, object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { SignUpControllerTypes } from "types/controllers/User/SignUpController";

import { ACCOUNT_RULES } from "@shared/constants/rules";

import { setYupError } from "@helpers/yup/setError";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { EMAIL, PASSWORD } = ACCOUNT_RULES;

const bodySchema: SuperSchema.Fragment<SignUpControllerTypes.v1.Body> = object({
  id: number().required().integer(),

  email: string()
    .trim()
    .email()
    .max(
      EMAIL.MAX_LENGTH,
      setYupError(CUSTOM_MESSAGES.GENERAL.MAX_CHARACTERS, EMAIL.MAX_LENGTH)
    )
    .required()
    .transform(value => value.toLowerCase()),

  signUpCode: string().required(),

  password: string()
    .required()
    .min(PASSWORD.MIN_LENGTH)
    .matches(
      PASSWORD.ONE_LOWERCASE_LETTER_REGEX,
      setYupError(CUSTOM_MESSAGES.AUTH.PASSWORD.ONE_LOWERCASE_LETTER)
    )
    .matches(
      PASSWORD.ONE_UPPERCASE_LETTER_REGEX,
      setYupError(CUSTOM_MESSAGES.AUTH.PASSWORD.ONE_UPPERCASE_LETTER)
    )
    .matches(
      PASSWORD.ONE_DIGIT_LETTER_REGEX,
      setYupError(CUSTOM_MESSAGES.AUTH.PASSWORD.ONE_DIGIT)
    )
    .matches(
      PASSWORD.ONE_SPECIAL_CHARACTER_REGEX,
      setYupError(CUSTOM_MESSAGES.AUTH.PASSWORD.ONE_SPECIAL_CHARACTER)
    ),
});

export const useSignUpSuperSchema: SuperSchema.Runner<
  void,
  SignUpControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
