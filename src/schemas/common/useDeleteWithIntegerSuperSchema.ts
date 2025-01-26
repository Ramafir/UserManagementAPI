import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { DeleteControllerWithIntegerTypes } from "types/controllers/DeleteControllerWithInteger";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<DeleteControllerWithIntegerTypes.v1.Params> =
  object({
    id: number()
      .required()
      .transform(value => parseInt(value)),
  });

const querySchema: SuperSchema.Fragment<DeleteControllerWithIntegerTypes.v1.Query> =
  object({
    workspaceId: number().required(),
  });

export const useDeleteWithIntegerSuperSchema: SuperSchema.Runner<
  DeleteControllerWithIntegerTypes.v1.Params,
  void,
  DeleteControllerWithIntegerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
    params: paramsSchema,
  };
});
