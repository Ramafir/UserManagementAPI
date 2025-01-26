import { IUserSessionDTO } from "@shared/types/DTOs/Auth";
import { PermissionToRole } from "@db/entities/PermissionToRole";
import { Permission as PermissionEntity } from "@db/entities/Permission";

export namespace DataStore {
  export const enum KeyType {
    AuthenticatedUser = "session",
    Role = "role",
  }

  export type Key = [string | number, KeyType];

  export type Permission = Pick<PermissionEntity, "signature"> &
    Pick<PermissionToRole, "enabled">;

  export type Role = {
    id: number;

    permissions: Permission[];
  };

  export type User = { userId: string } & Omit<
    IUserSessionDTO,
    "isRequesterSession"
  >;
}
