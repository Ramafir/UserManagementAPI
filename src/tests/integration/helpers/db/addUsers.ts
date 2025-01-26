import { User } from "@db/entities/User";
import { PASSWORD } from "@integration-tests/config";
import { IRoleRepository } from "types/repositories/IRoleRepository";
import { IUserRepository } from "types/repositories/IUserRepository";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const addUsers = async (
  usersToAdd: {
    email: string;
    isSignedUp: boolean;
    roleNameOrId: number | string;
  }[]
) => {
  const users: User[] = [];

  const userRepository = getInstanceOf<IUserRepository>(Di.UserRepository);
  const roleRepository = getInstanceOf<IRoleRepository>(Di.RoleRepository);

  const roles = await Promise.all(
    usersToAdd
      .filter(userToAdd => typeof userToAdd.roleNameOrId === "string")
      .map(userToAdd =>
        roleRepository.getOne({
          where: {
            name: <string>userToAdd.roleNameOrId,
          },
        })
      )
  );

  for (const userToAdd of usersToAdd) {
    const { email, isSignedUp, roleNameOrId } = userToAdd;

    const role =
      typeof roleNameOrId === "number"
        ? { id: roleNameOrId }
        : roles.find(role => role?.name === roleNameOrId);

    if (!role) {
      throw Error(
        `Attempted to assign role ${roleNameOrId} to ${email} that does not exist!`
      );
    }

    const user = await userRepository.primitiveSave({
      firstName: "F123N",
      lastName: "L123N",
      email,
      password: PASSWORD,
      isSignedUp,
      role,
    });

    users.push(user);
  }

  return users;
};
