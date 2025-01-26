import { Directory } from "@db/entities/Directory";
import { IDirectoryRepository } from "types/repositories/IDirectoryRepository";

import { FILES } from "@config";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const addDirectories = async (
  directoriesToAdd: {
    id: number;
    relativePath: string;
  }[]
) => {
  const directories: Directory[] = [];

  const directoryRepository = getInstanceOf<IDirectoryRepository>(
    Di.DirectoryRepository
  );

  for (const directoryToAdd of directoriesToAdd) {
    const { id, relativePath } = directoryToAdd;

    const directoryEntity = directoryRepository.createEntity({
      id,
      relativePath: relativePath.startsWith(FILES.ROOT)
        ? relativePath
        : `${FILES.ROOT}/${relativePath}`,
    });

    const directory = await directoryRepository.primitiveSave(directoryEntity);

    directories.push(directory);
  }

  return directories;
};
