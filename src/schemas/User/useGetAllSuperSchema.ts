import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetAllControllerTypes } from "types/controllers/User/GetAllController";

import { pageSchema, perPageSchema } from "@schemas/common/paginationSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<GetAllControllerTypes.v1.QueryInput> =
  object({
    page: pageSchema,
    perPage: perPageSchema,
    filters: object()
      .default({})
      .transform(value => JSON.parse(value))
      .required()
      .shape({
        workspaceId: number().optional().min(1),
      }),
  });

export const useGetAllSuperSchema: SuperSchema.Runner<
  void,
  void,
  GetAllControllerTypes.v1.QueryInput
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
  };
});
