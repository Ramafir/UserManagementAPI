import { Channel } from "amqplib";

import { getInstanceOf } from "./getInstanceOf";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";

// @NOTE consider extracting to QueueService
export const sendToQueue = <T>(queue: Queue, data: T) => {
  const publisher = getInstanceOf<Channel>(Di.Publisher);

  if (!publisher) {
    return false;
  }

  return publisher.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
};
