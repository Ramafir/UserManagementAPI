import { Container } from 'typedi';
import { Sequelize } from 'sequelize-typescript';

import type {
    RedisScripts,
    RedisModules,
    RedisFunctions,
    RedisClientType
} from 'redis';

export const shutdown = async (killProcess = false, status = 0) => {
    if (Container.has('sequelize')) {
        try {
            const sequelize: Sequelize = Container.get('sequelize');
            await sequelize.close();
        } catch {
            console.error(
                'There was an error during shutting down sequelize connection!'
            );
        }
    }

    if (Container.has('redisSessionClient')) {
        try {
            const redisSessionClient: RedisClientType<
                RedisModules,
                RedisFunctions,
                RedisScripts
            > = Container.get('redisSessionClient');
            await redisSessionClient.disconnect();
        } catch {
            console.error(
                'There was an error during shutting down redis session connection!'
            );
        }
    }

    if (Container.has('redisCacheClient')) {
        try {
            const redisCacheClient: RedisClientType<
                RedisModules,
                RedisFunctions,
                RedisScripts
            > = Container.get('redisCacheClient');
            await redisCacheClient.disconnect();
        } catch {
            console.error(
                'There was an error during shutting down redis cache connection!'
            );
        }
    }

    if (killProcess) {
        process.exit(status);
    }
};
