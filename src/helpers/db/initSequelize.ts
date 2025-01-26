import { Container } from 'typedi';
import { config as defaultConfig } from '@/config';
import { SequelizeFactory } from '@/services/factories/SequelizeFactory';
import type { IDBConfig } from '@/types/config';
import type { ISequelizeFactoryOptions } from '@/types/common';

export const initSequelize = (config?: IDBConfig) => {
    const { dialect, name, username, password, host, port, logging, define } = config || defaultConfig.db;

    console.log(dialect, name, username, password, host, port, logging, define);

    const options: ISequelizeFactoryOptions = {
        dialect,
        database: name || '',
        username: username || '',
        password: password || '',
        host: host || 'localhost',
        port: port || 3306,
        logging: logging || false,
        define: define || {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            timestamps: false,
        },
    };

    const sequelizeFactory = Container.get(SequelizeFactory);

    return sequelizeFactory.create(options);
};
