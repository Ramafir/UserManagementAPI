import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetNotesControllerTypes } from "types/controllers/User/GetNotesController";

import { pageSchema } from "@schemas/common/paginationSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<GetNotesControllerTypes.v1.Params> =
  object({
    id: number()
      .required()
      .transform(value => parseInt(value)),
  });

const querySchema: SuperSchema.Fragment<GetNotesControllerTypes.v1.QueryInput> =
  object({
    page: pageSchema,
  });

export const useGetNotesSuperSchema: SuperSchema.Runner<
  GetNotesControllerTypes.v1.Params,
  void,
  GetNotesControllerTypes.v1.QueryInput
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    query: querySchema,
  };
});
