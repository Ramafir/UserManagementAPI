import { UserMapper } from "@mappers/UserMapper";
import { PaginatedResponse } from "@shared/types/PaginatedResponse";
import { IPaginationQuery } from "@shared/types/IPaginationQuery";
import { IPaginationOptions } from "types/IPaginationOptions";

export namespace GetAllControllerTypes {
  export namespace v1 {
    type CommonQuery = {
      filters: { workspaceId?: number };
    };

    export type QueryInput = IPaginationQuery & CommonQuery;

    export type QueryOutput = IPaginationOptions & CommonQuery;

    export type Request = CustomRequest<undefined, undefined, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<UserMapper>>;
  }
}
