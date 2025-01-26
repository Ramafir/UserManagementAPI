import { object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { PinControllerTypes } from "types/controllers/PinController";
import { UnpinControllerTypes } from "types/controllers/UnpinController";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

// @NOTE to "watch over" both Pin/Unpin types
type TogglePinParams = PinControllerTypes.v1.Params &
  UnpinControllerTypes.v1.Params;

export const getTogglePinSuperSchema: (
  repository: Di
) => SuperSchema.Runner<TogglePinParams, void, void> = (repository: Di) => {
  const paramsSchema: SuperSchema.Fragment<TogglePinParams> = object({
    id: useIdNumberSchema(repository),
  });

  return defineSuperSchemaRunner(() => {
    return {
      params: paramsSchema,
    };
  });
};
