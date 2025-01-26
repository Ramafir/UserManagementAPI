import { faker } from "@faker-js/faker";
import { ChatMessage } from "@db/entities/ChatMessage";
import { IUserRepository } from "types/repositories/IUserRepository";
import { IChatMessageRepository } from "types/repositories/IChatMessageRepository";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const addChatMessages = async (
  chatMessagesToAdd: {
    id: number;
    value?: string;
    replyToId?: number;
    email?: string;
  }[]
) => {
  const chatMessages: ChatMessage[] = [];

  const chatMessageRepository = getInstanceOf<IChatMessageRepository>(
    Di.ChatMessageRepository
  );
  const userRepository = getInstanceOf<IUserRepository>(Di.UserRepository);

  for (const chatMessageToAdd of chatMessagesToAdd) {
    const { id, replyToId, value, email } = chatMessageToAdd;

    const createdBy = email
      ? await userRepository.getOne({
          where: {
            email,
          },
        })
      : { id: 1 };

    if (!createdBy) {
      throw Error(
        `Attempted to create chat message for unexisting user: ${email}`
      );
    }

    const chatMessageEntity = chatMessageRepository.createEntity({
      id,
      value: value ?? faker.lorem.words(10),
      createdBy,
      replyTo: {
        id: replyToId,
      },
    });

    const chatMessage = await chatMessageRepository.primitiveSave(
      chatMessageEntity
    );

    chatMessages.push(chatMessage);
  }

  return chatMessages;
};
