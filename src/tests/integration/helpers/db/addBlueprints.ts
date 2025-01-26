import sample from "lodash/sample";
import { User } from "@db/entities/User";
import { Blueprint } from "@db/entities/Blueprint";
import { IBlueprintRepository } from "types/repositories/IBlueprintRepository";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";
import { getOptionsOfTraceRelatedEntity } from "@helpers/getOptionsOfTraceRelatedEntity";

export const addBlueprints = async (
  blueprintstoAdd: {
    id: number;
    name: string;
    color: string;
    description: string;
    workspaceId: number;
  }[],
  users?: User[]
) => {
  const blueprints: Blueprint[] = [];

  const blueprintRepository = getInstanceOf<IBlueprintRepository>(
    Di.BlueprintRepository
  );

  for (const blueprintToAdd of blueprintstoAdd) {
    const { workspaceId, ...data } = blueprintToAdd;

    const author = {
      createdBy: {
        id: 1,
      },
      updatedBy: {
        id: 1,
      },
    };

    if (users?.length) {
      const user = sample(users) || users[0];

      author.createdBy.id = user.id;
      author.updatedBy.id = user.id;
    }

    const blueprintEntity = blueprintRepository.createEntity({
      ...data,
      workspace: {
        id: workspaceId,
      },
      ...author,
    });

    const blueprint = await blueprintRepository.primitiveSave(
      blueprintEntity,
      getOptionsOfTraceRelatedEntity({
        userId: author.createdBy.id,
        workspaceId,
      })
    );

    blueprints.push(blueprint);
  }

  return blueprints;
};
