import { Container } from 'typedi';

import { config as defaultConfig } from '@/config';
import { SequelizeFactory } from '@/services/factories/SequelizeFactory';

import type { IDBConfig } from '@/types/config';
import type { ISequelizeFactoryOptions } from '@/types/common';

export const initSequelize = (config?: IDBConfig) => {
    const { dialect, name, username, password, write, logging, define } = config || defaultConfig.db;

    console.log(dialect, name, username, password, write, logging, define);
    
    const options: ISequelizeFactoryOptions = {
        dialect,
        database: name,
        username,
        password,
        writeOptions: write,
        logging,
        define
    };

    const sequelizeFactory = Container.get(SequelizeFactory);

    return sequelizeFactory.create(options);
};
