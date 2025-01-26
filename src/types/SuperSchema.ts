import { Schema } from "yup";

export namespace SuperSchema {
  export type Keys = {
    body: string;

    query: string;

    params: string;
  };

  export type Fragment<T = void> = Schema<T>;

  export type CommonParam<P, B, Q> = {
    request: CustomRequest<P, B, Q>;
  };

  type PartOfDefinition<T, K extends keyof Keys> = T extends void
    ? unknown
    : { [P in K]: Schema<T> };

  export type Definition<P = void, B = void, Q = void> = PartOfDefinition<
    P,
    "params"
  > &
    PartOfDefinition<B, "body"> &
    PartOfDefinition<Q, "query">;

  export type Runner<P, B, Q> = (
    common: CommonParam<P, B, Q>
  ) => Definition<P, B, Q> | Promise<Definition<P, B, Q>>;
}
