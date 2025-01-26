import bcrypt from "bcrypt";
import { User } from "@db/entities/User";
import {
  InsertEvent,
  EventSubscriber,
  EntitySubscriberInterface,
} from "typeorm";

import { BCRYPT } from "@config/index";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    const { entity } = event;

    if (entity.password) {
      entity.password = await bcrypt.hash(entity.password, BCRYPT.SALT_ROUNDS);
    }
  }
}
