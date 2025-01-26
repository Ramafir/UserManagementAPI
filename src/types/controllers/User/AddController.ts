import { UserMapper } from "@mappers/UserMapper";
import { IAddUserDTO } from "@shared/types/DTOs/User";

export namespace AddControllerTypes {
  export namespace v1 {
    export type Body = IAddUserDTO;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<UserMapper>;
  }
}
