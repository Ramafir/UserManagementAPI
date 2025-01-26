import { IUserRepository } from "types/repositories/IUserRepository";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const setUserWorkspacesAccess = async (arg: {
  email: string;
  workspaceIds: number[];
}) => {
  const { email, workspaceIds } = arg;

  const userRepository = getInstanceOf<IUserRepository>(Di.UserRepository);

  const user = await userRepository.getOne({ where: { email } });

  if (!user) {
    throw Error(
      `Attempted to set workspaces access of ${email} but such user does not exist!`
    );
  }

  return userRepository.updateWorkspacesAccess(user.id, workspaceIds);
};
