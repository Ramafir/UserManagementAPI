import { inject, injectable } from "tsyringe";
import { Channel, Connection } from "amqplib";
import { IConsumerFactory } from "types/factories/IConsumerFactory";
import { IBaseConsumerHandler } from "types/consumer-handlers/IBaseConsumerHandler";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { Dependency } from "@enums/Dependency";

import { getInstanceOf } from "@helpers/getInstanceOf";

@injectable()
export class ConsumerFactory implements IConsumerFactory {
  constructor(
    @inject(Di.RabbitMQ)
    private _rabbitMQ: Connection
  ) {}

  async create(queue: Queue, handler: Di): Promise<Channel> {
    const channel = await this._rabbitMQ.createChannel();

    await channel.assertQueue(queue);

    channel.consume(queue, async message => {
      if (message === null) {
        log.warning({
          message: "Consumer cancelled by server!",
          dependency: Dependency.RabbitMQ,
        });

        return;
      }

      const instance = getInstanceOf<IBaseConsumerHandler<unknown>>(handler);

      const content = message.content.toString();

      const data = JSON.parse(content);

      const isSuccessful = await instance.handle(data);

      if (isSuccessful) {
        channel.ack(message);

        log.debug({
          message: `Consumer completed task of ${queue} queue.`,
          dependency: Dependency.RabbitMQ,
        });

        return;
      }

      await instance.onFailure(data);

      channel.nack(message, false, false);

      log.warning({
        message: `Consumer failed to complete task of ${queue} queue.`,
        dependency: Dependency.RabbitMQ,
      });
    });

    return channel;
  }
}
