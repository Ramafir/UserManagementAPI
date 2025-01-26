import { string } from "yup";

import { ACCOUNT_RULES } from "@shared/constants/rules";

const { FIRST_NAME, LAST_NAME } = ACCOUNT_RULES;

export const firstNameSchema = string()
  .required()
  .min(FIRST_NAME.MIN_LENGTH)
  .max(FIRST_NAME.MAX_LENGTH);

export const lastNameSchema = string()
  .required()
  .min(LAST_NAME.MIN_LENGTH)
  .max(LAST_NAME.MAX_LENGTH);
