import { faker } from "@faker-js/faker";
import { User } from "@db/entities/User";
import { Note } from "@db/entities/Note";
import { INoteRepository } from "types/repositories/INoteRepository";
import { IUserRepository } from "types/repositories/IUserRepository";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";
import { getOptionsOfTraceRelatedEntity } from "@helpers/getOptionsOfTraceRelatedEntity";

export const addNotes = async (
  notesToAdd: {
    id: number;
    value?: string;
    fileId: number;
    email?: string;
    workspaceId: number;
  }[]
) => {
  const notes: Note[] = [];
  const users: User[] = [];

  const noteRepository = getInstanceOf<INoteRepository>(Di.NoteRepository);
  const userRepository = getInstanceOf<IUserRepository>(Di.UserRepository);

  for (const noteToAdd of notesToAdd) {
    if (!noteToAdd.email) {
      continue;
    }

    const user = await userRepository.findByEmail(noteToAdd.email);

    if (user) {
      users.push(user);
    }
  }

  for (const noteToAdd of notesToAdd) {
    const { id, value, fileId, email, workspaceId } = noteToAdd;

    let userId = 1;

    if (email) {
      userId = users.find(user => user.email === email)?.id || 1;
    }

    const noteEntity = noteRepository.createEntity({
      id,
      value: value ?? faker.lorem.words(10),
      file: {
        id: fileId,
      },
      createdBy: {
        id: userId,
      },
      updatedBy: {
        id: userId,
      },
    });

    const note = await noteRepository.primitiveSave(
      noteEntity,
      getOptionsOfTraceRelatedEntity({
        userId,
        workspaceId,
      })
    );

    notes.push(note);
  }

  return notes;
};
