import { Service } from 'typedi';
import { Sequelize } from 'sequelize-typescript';
import { ConnectionError, type Dialect } from 'sequelize';

import { config } from '@/config';

import type { ISequelizeFactoryOptions } from '@/types/common';

@Service()
export class SequelizeFactory {
    create(options: ISequelizeFactoryOptions) {
        const {
            dialect,
            database,
            username,
            password,
            writeOptions,
            readOptions,
            define,
            logging
        } = options;

        const extension = __filename.split('.').pop() || 'ts';

        const useReplication = writeOptions && readOptions;

        const sequelize: Sequelize = new Sequelize({
            dialect: dialect as Dialect,
            database,
            username,
            password,
            ...(useReplication
                ? {
                      replication: {
                          write: writeOptions,
                          read: Array.isArray(readOptions)
                              ? readOptions
                              : [readOptions]
                      }
                  }
                : {
                      host: writeOptions.host,
                      port: writeOptions.port
                  }),
            define,
            logging,
            models: [__dirname + `/../../models/*.${extension}`],
            repositoryMode: true,
            retry: {
                match: [ConnectionError],
                max: 3,
                backoffBase: 2000
            },
            pool: {
                max: 10,
                min: 2
            }
        });

        return sequelize;
    }
}
