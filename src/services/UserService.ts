import assert from "assert";
import { In } from "typeorm";
import { Role } from "@db/entities/Role";
import { User } from "@db/entities/User";
import { inject, injectable } from "tsyringe";
import { IUserService } from "types/services/IUserService";
import { TransactionResult } from "types/TransactionResult";
import { IUserRepository } from "types/repositories/IUserRepository";
import { TransactionError } from "types/custom-errors/TransactionError";

import { Di } from "@enums/Di";
import { Dependency } from "@enums/Dependency";
import { IUpdateUserDTO } from "@shared/types/DTOs/User";

import { getUniqueValuesFromCollection } from "@helpers/getUniqueValuesFromCollection";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository
  ) {}

  async updateMany(
    usersToUpdate: IUpdateUserDTO[]
  ): Promise<TransactionResult<User[]>> {
    const transaction = await this._userRepository.useTransaction();
    const { manager } = transaction;

    const uniqueRoleIds = getUniqueValuesFromCollection<IUpdateUserDTO, number>(
      usersToUpdate,
      "data.roleId"
    );

    const roles: Role[] = [];

    try {
      if (uniqueRoleIds.length) {
        roles.push(
          ...(await manager.find(Role, {
            where: {
              id: In(uniqueRoleIds),
            },
          }))
        );
      }

      if (roles.length !== uniqueRoleIds.length) {
        throw new TransactionError(
          `Not all roles are available to perform operation.`
        );
      }

      const entities = usersToUpdate.map(
        ({ id, data: { isActive, roleId } }) => {
          const userData: User = manager.create(User, {
            id,
          });

          if (typeof isActive === "boolean") {
            userData.deletedAt = isActive ? null : new Date();
          }

          if (roleId) {
            const role = roles.find(role => role.id === roleId);
            assert(role);

            userData.role = role;
          }

          return userData;
        }
      );

      const users = await manager.save(User, entities);

      await transaction.commitTransaction();

      return TransactionResult.success(users);
    } catch (error) {
      log.error({
        error,
        dependency: Dependency.TypeORM,
        message: `Failed to update users!`,
      });

      await transaction.rollbackTransaction();

      return TransactionResult.failure(
        error instanceof TransactionError ? error.message : undefined
      );
    } finally {
      await transaction.release();
    }
  }
}
