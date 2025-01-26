import { IUpdateProfileDTO } from "@shared/types/DTOs/User";

export namespace UpdateProfileControllerTypes {
  export namespace v1 {
    export type Body = IUpdateProfileDTO;

    export type Request = CustomRequest<void, Body>;
  }
}
