import { NoteMapper } from "@mappers/NoteMapper";
import { PaginatedResponse } from "@shared/types/PaginatedResponse";
import { IPaginationQuery } from "@shared/types/IPaginationQuery";
import { IPaginationOptions } from "types/IPaginationOptions";

export namespace GetNotesControllerTypes {
  export namespace v1 {
    export type Params = { id: number };

    export type QueryInput = Pick<IPaginationQuery, "page">;

    export type QueryOutput = IPaginationOptions;

    export type Request = CustomRequest<Params, undefined, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<NoteMapper>>;
  }
}
