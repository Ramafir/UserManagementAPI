import { User } from "@db/entities/User";
import { IBaseRepository } from "./IBaseRepository";
import { TransactionResult } from "types/TransactionResult";

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(
    email: string,
    options?: { includePermissions: boolean }
  ): Promise<User | null>;

  getRoleId(userId: number): Promise<number>;

  filterUsersWithAccessToWorkspace(
    workspaceId: number,
    userIds: number[]
  ): Promise<User[]>;

  updateWorkspacesAccess(
    userId: number,
    workspaceIds: number[]
  ): Promise<TransactionResult<void>>;
}
