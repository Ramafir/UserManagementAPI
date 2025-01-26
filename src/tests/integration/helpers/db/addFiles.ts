import { faker } from "@faker-js/faker";
import { File } from "@db/entities/File";
import { Directory } from "@db/entities/Directory";
import { IFileRepository } from "types/repositories/IFileRepository";
import { IDirectoryRepository } from "types/repositories/IDirectoryRepository";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const addFiles = async (
  filesToAdd: {
    id: number;
    originalFilename?: string;
    relativePath: string;
    workspaceId: number;
  }[]
) => {
  const files: File[] = [];
  const directories: Directory[] = [];

  const fileRepository = getInstanceOf<IFileRepository>(Di.FileRepository);
  const directoryRepository = getInstanceOf<IDirectoryRepository>(
    Di.DirectoryRepository
  );

  for (const { relativePath } of filesToAdd) {
    if (
      directories.some(directory => directory.relativePath === relativePath)
    ) {
      continue;
    }

    const directory = await directoryRepository.getOne({
      where: {
        relativePath,
      },
    });

    if (directory) {
      directories.push(directory);
    }
  }

  for (const fileToAdd of filesToAdd) {
    const { id, relativePath, workspaceId, originalFilename } = fileToAdd;

    const directory = directories.find(
      directory => directory.relativePath == relativePath
    );

    if (!directory) {
      throw Error(
        `Attempted to create file with missing directory - ${relativePath}`
      );
    }

    const fileEntity = fileRepository.createEntity({
      id,
      originalFilename: originalFilename ?? faker.system.commonFileName(),
      directory,
      workspace: {
        id: workspaceId,
      },
    });

    const file = await fileRepository.primitiveSave(fileEntity);

    files.push(file);
  }

  return files;
};
