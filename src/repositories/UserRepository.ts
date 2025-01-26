import { In } from "typeorm";
import { injectable } from "tsyringe";
import { User } from "@db/entities/User";
import { TransactionResult } from "types/TransactionResult";
import { UserToWorkspace } from "@db/entities/UserToWorkspace";
import { IUserRepository } from "types/repositories/IUserRepository";

import { BaseRepository } from "./BaseRepository";

import { Permission } from "@shared/types/enums/Permission";

@injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor() {
    super(User);
  }

  findByEmail(
    email: string,
    options?: { includePermissions: boolean }
  ): Promise<User | null> {
    const permissionsRelation = options?.includePermissions
      ? {
          relations: {
            role: {
              permissionToRole: {
                permission: true,
              },
            },
          },
        }
      : {};

    return this.database.findOne({
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        isSignedUp: true,
        lastName: true,
        fullName: true,
      },
      where: {
        email,
      },
      ...permissionsRelation,
    });
  }

  async getRoleId(userId: number): Promise<number> {
    const user = await this.database.findOne({
      where: {
        id: userId,
      },
      loadRelationIds: {
        relations: ["role"],
      },
    });

    if (!user || typeof user.role !== "number") {
      return 0;
    }

    return user.role;
  }

  filterUsersWithAccessToWorkspace(
    workspaceId: number,
    userIds: number[]
  ): Promise<User[]> {
    return this.database.find({
      where: [
        {
          userToWorkspace: {
            userId: In(userIds),
            workspaceId,
          },
        },
        {
          role: {
            permissionToRole: {
              permission: {
                signature: Permission.ViewAllWorkspaces,
              },
              enabled: true,
            },
          },
        },
      ],
    });
  }

  async updateWorkspacesAccess(
    userId: number,
    workspaceIds: number[]
  ): Promise<TransactionResult<void>> {
    const transaction = await this.useTransaction();

    try {
      const userToWorkspaceCollection = await transaction.manager.find(
        UserToWorkspace,
        {
          where: {
            userId,
          },
          withDeleted: true,
        }
      );

      for (const userToWorkspaceItem of userToWorkspaceCollection) {
        if (
          !!userToWorkspaceItem.deletedAt &&
          workspaceIds.includes(userToWorkspaceItem.workspaceId)
        ) {
          await transaction.manager.recover(userToWorkspaceItem);

          continue;
        }

        if (!workspaceIds.includes(userToWorkspaceItem.workspaceId)) {
          await transaction.manager.softRemove(userToWorkspaceItem);
        }
      }

      const idsToAdd = workspaceIds.filter(workspaceId =>
        userToWorkspaceCollection.every(
          item => item.workspaceId !== workspaceId
        )
      );

      for (const idToAdd of idsToAdd) {
        await transaction.manager.save(UserToWorkspace, {
          userId,
          workspaceId: idToAdd,
        });
      }

      await transaction.commitTransaction();

      return TransactionResult.success();
    } catch (error) {
      await transaction.rollbackTransaction();

      return TransactionResult.failure();
    } finally {
      await transaction.release();
    }
  }
}
