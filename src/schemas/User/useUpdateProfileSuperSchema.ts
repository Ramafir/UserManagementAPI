import { object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { UpdateProfileControllerTypes } from "types/controllers/User/UpdateProfileController";

import { firstNameSchema, lastNameSchema } from "./nameSchemas";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchema.Fragment<UpdateProfileControllerTypes.v1.Body> =
  object({
    firstName: firstNameSchema,

    lastName: lastNameSchema,
  });

export const useUpdateProfileSuperSchema: SuperSchema.Runner<
  void,
  UpdateProfileControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
