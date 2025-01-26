import 'reflect-metadata';
import 'module-alias/register';

import { Container } from 'typedi';

import { config } from '@/config';
import { initSequelize } from '@/helpers/db/initSequelize';
import { SeedersWorkHandler } from '@/services/seeders/WorkHandler';

const {
    app: { seedersLogging }
} = config;

const sequelize = initSequelize();

Container.set('sequelize', sequelize);

const seedersWorkHandler = Container.get(SeedersWorkHandler);

(async function () {
    if (seedersLogging) {
        console.log('Work seeders script has started.');
    }

    await seedersWorkHandler.handle();

    await sequelize.close();

    if (seedersLogging) {
        console.log('Work seeders script has finished.');
    }
})();
