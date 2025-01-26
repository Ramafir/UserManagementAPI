import { Umzug, SequelizeStorage } from 'umzug';

import { config as defaultConfig } from '@/config';
import { initSequelize } from '@/helpers/db/initSequelize';

import type { IDBConfig } from '@/types/config';

export const migrate = async (config?: IDBConfig) => {
    console.log('Migration script has started.');

    const sequelize = initSequelize(config);

    const extension = __filename.split('.').pop() || 'ts';

    const umzug = new Umzug({
        migrations: {
            glob: `${__dirname}/../../migrations/*.${extension}`
        },
        context: sequelize,
        storage: new SequelizeStorage({ sequelize }),
        logger: defaultConfig.app.seedersLogging ? console : undefined
    });

    await umzug.up();

    await sequelize.close();

    console.log('Migration script has finished.');
};
