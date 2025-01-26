import kebabCase from "lodash/kebabCase";
import { Workspace } from "@db/entities/Workspace";
import { IWorkspaceRepository } from "types/repositories/IWorkspaceRepository";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const addWorkspaces = async (
  workspacesToAdd: { id: number; name: string; description: string }[]
) => {
  const workspaces: Workspace[] = [];
  const workspaceRepository = getInstanceOf<IWorkspaceRepository>(
    Di.WorkspaceRepository
  );

  for (const workspaceToAdd of workspacesToAdd) {
    const workspaceEntity = workspaceRepository.createEntity({
      ...workspaceToAdd,
      slug: kebabCase(workspaceToAdd.name),
      tagToWorkspace: [],
    });

    const workspace = await workspaceRepository.primitiveSave(workspaceEntity);

    workspaces.push(workspace);
  }

  return workspaces;
};
