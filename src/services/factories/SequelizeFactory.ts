import { Service } from 'typedi';
import { Sequelize } from 'sequelize-typescript';
import { ConnectionError, type Dialect } from 'sequelize';
import type { ISequelizeFactoryOptions } from '@/types/common';

@Service()
export class SequelizeFactory {
    create(options: ISequelizeFactoryOptions) {
        const {
            dialect,
            database,
            username,
            password,
            host,
            port,
            define,
            logging,
        } = options;

        const extension = __filename.split('.').pop() || 'ts';

        const sequelize: Sequelize = new Sequelize({
            dialect: dialect as Dialect,
            database,
            username,
            password,
            host,
            port,
            define,
            logging,
            models: [__dirname + `/../../models/*.${extension}`],
            repositoryMode: true,
            retry: {
                match: [ConnectionError],
                max: 3,
                backoffBase: 2000,
            },
            pool: {
                max: 10,
                min: 2,
                idle: 10000,
            },
        });

        return sequelize;
    }
}
