import { User } from "@db/entities/User";
import { ChatMessage } from "@db/entities/ChatMessage";
import {
  InsertEvent,
  RemoveEvent,
  EventSubscriber,
  EntitySubscriberInterface,
} from "typeorm";

@EventSubscriber()
export class ChatMessageSubscriber
  implements EntitySubscriberInterface<ChatMessage>
{
  listenTo() {
    return ChatMessage;
  }

  async beforeRemove(event: RemoveEvent<ChatMessage>) {
    const { manager, entity } = event;

    if (!entity) {
      // @NOTE entity removed without being loaded (e.g. removed through criteria or cascades)
      return;
    }

    const { replyTo } = await manager.findOneOrFail(ChatMessage, {
      where: {
        id: entity.id,
      },
      relations: {
        replyTo: true,
      },
    });

    if (replyTo?.repliesCount >= 1) {
      replyTo.repliesCount = replyTo.repliesCount - 1;

      await manager.save(ChatMessage, replyTo);
    }
  }

  async beforeInsert(event: InsertEvent<ChatMessage>) {
    const { manager, entity } = event;
    const { replyTo, createdBy } = entity;

    const parentMessage = replyTo?.id
      ? await manager.findOneByOrFail(ChatMessage, {
          id: replyTo.id,
        })
      : null;

    if (parentMessage) {
      entity.depth = parentMessage.depth + 1;

      parentMessage.repliesCount = (parentMessage.repliesCount || 0) + 1;

      await manager.save(parentMessage);
    } else {
      entity.depth = 1;
    }

    entity.createdBy = await manager.findOneByOrFail(User, {
      id: createdBy.id,
    });
  }
}
