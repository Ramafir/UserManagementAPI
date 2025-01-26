import { number } from "yup";

import { APP } from "@config";

export const pageSchema = number().required().integer().min(1);

export const perPageSchema = number()
  .required()
  .integer()
  .min(5)
  .max(APP.MAX_ITEMS_PER_PAGE);
