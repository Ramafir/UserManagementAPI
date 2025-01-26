import { IPatchUserToWorkspaceDTO } from "@shared/types/DTOs/User";

export namespace PatchUserToWorkspaceControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = IPatchUserToWorkspaceDTO;

    export type Request = CustomRequest<Params, Body>;

    export type Response = CustomResponse<string>;
  }
}
