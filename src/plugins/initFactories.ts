import pluralize from 'pluralize';
import { Container } from 'typedi';

import { config } from '@/config';
import { processType } from '@/helpers/factories';
import { Publisher } from '@/services/queues/Publisher';
import { RedisManager } from '@/services/redis/RedisManager';
import { QueueFactory } from '@/services/queues/QueueFactory';
import { ChannelFactory } from '@/services/queues/ChannelFactory';
import { SequelizeFactory } from '@/services/factories/SequelizeFactory';
import { EmailConsumer } from '@/services/queues/consumers/EmailConsumer';
import { NodemailerFactory } from '@/services/factories/NodemailerFactory';
import { RedisStoreFactory } from '@/services/factories/RedisStoreFactory';
import { RedisClientFactory } from '@/services/factories/RedisClientFactory';
import { GraylogClientFactory } from '@/services/factories/GraylogClientFactory';
import { RabbitMQConnectionFactory } from '@/services/factories/RabbitMQConnectionFactory';

import type { IProcess } from '@/types/factories';
import type { ISequelizeFactoryOptions } from '@/types/common';

const {
    redisCache: { url: redisCacheUrl },
    redisSession: { url: redisSessionUrl },
    cache: { isEnabled: isCacheEnabled, keyExpiresInMinutes: cacheKeyExpiresInMinutes },
    db: { dialect, name, username, password, write, read, logging, define },
    email: emailConfig,
    rabbitmq: { url: rabbitUrl },
    graylog: { host: graylogHost, port: graylogPort, facility: graylogFacility }
} = config;

const sequelizeOptions: ISequelizeFactoryOptions = {
    dialect,
    database: name,
    username,
    password,
    writeOptions: write,
    readOptions: read,
    logging,
    define
};

export const initFactories = async (process: IProcess) => {
    let graylogClient = null;
    let nodemailer = null;
    let sequelize = null;
    let redisSessionClient = null;
    let redisSessionStore = null;
    let redisSessionManager = null;
    let redisCacheClient = null;
    let redisCacheManager = null;
    let rabbitMQConnection = null;

    const sequelizeFactory = Container.get(SequelizeFactory);
    sequelize = sequelizeFactory.create(sequelizeOptions);

    const graylogClientFactory = Container.get(GraylogClientFactory);
    graylogClient = graylogClientFactory.create(graylogHost, graylogPort, graylogFacility);

    const nodemailerFactory = Container.get(NodemailerFactory);
    nodemailer = nodemailerFactory.create(emailConfig);

    const redisClientFactory = Container.get(RedisClientFactory);
    const redisStoreFactory = Container.get(RedisStoreFactory);

    redisSessionClient = await redisClientFactory.create(redisSessionUrl);
    redisSessionStore = redisStoreFactory.create(redisSessionClient);
    redisSessionManager = new RedisManager(redisSessionClient);

    redisCacheClient = await redisClientFactory.create(redisCacheUrl);
    redisCacheManager = new RedisManager(redisCacheClient, isCacheEnabled, cacheKeyExpiresInMinutes);

    Container.set('graylogClient', graylogClient);

    Container.set('nodemailer', nodemailer);
    Container.set('sequelize', sequelize);
    Container.set('redisSessionClient', redisSessionClient);
    Container.set('redisSessionStore', redisSessionStore);
    Container.set('redisSessionManager', redisSessionManager);
    Container.set('redisCacheClient', redisCacheClient);
    Container.set('cacheManager', redisCacheManager);

    const queues = [
        {
            name: 'email',
            Consumer: EmailConsumer
        }
    ];

    const rabbitMQConnectionFactory = Container.get(RabbitMQConnectionFactory);
    rabbitMQConnection = await rabbitMQConnectionFactory.create(rabbitUrl);

    const queueFactory = Container.get(QueueFactory);
    const channelFactory = Container.get(ChannelFactory);

    Container.set('rabbitMQConnection', rabbitMQConnection);

    for (const queue of queues) {
        const { name, Consumer } = queue;

        const plural = pluralize(name);

        let channel = null;
        let publisher = null;
        let consumer = null;

        if (process !== processType.Tests) {
            channel = await channelFactory.create(rabbitMQConnection, plural);

            await queueFactory.create(channel, plural);

            publisher = new Publisher(channel, plural);

            if (process === processType.Queues) {
                consumer = new Consumer(channel, plural);
            }
        }

        Container.set(`${name}Channel`, channel);
        Container.set(`${name}Publisher`, publisher);
        Container.set(`${name}Consumer`, consumer);
    }
};
