import { SuperSchema } from "types/SuperSchema";

export const defineSuperSchemaRunner = <P, B, Q>(
  superSchemaRunner: (
    common: SuperSchema.CommonParam<P, B, Q>
  ) =>
    | SuperSchema.Definition<P, B, Q>
    | Promise<SuperSchema.Definition<P, B, Q>>
) => superSchemaRunner;
