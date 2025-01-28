import express from 'express';
import { DataSource } from 'typeorm';
import { IDataSourceFactory } from 'types/factories/IDataSourceFactory';

import { Di } from '@enums/Di';
import { Dependency } from '@enums/Dependency';

import { setupDi } from '@utils/setupDi';
import { setupExpress } from '@utils/setupExpress';
import { getInstanceOf } from '@helpers/getInstanceOf';
import { attachEngineIO } from '@utils/attachEngineIO';

export const server = async () => {
    const app = express();
    const { serverInstance, engineIO } = attachEngineIO(app);

    const di = await setupDi();

    const dataSource = await getInstanceOf<IDataSourceFactory>(Di.DataSourceFactory).create();

    di.registerExternalDependencies({
        engineIO,
        dataSource,
    });

    await setupExpress(app);

    return serverInstance;
};

export async function onExit(beforeExit?: () => Promise<void>) {
    await closeDatabaseConnection();

    if (beforeExit && typeof beforeExit === 'function') {
        await beforeExit();
    }

    process.exit();
}

async function closeDatabaseConnection() {
    log.info({
        message: `Closing connection...`,
        dependency: Dependency.TypeORM,
    });

    const dataSource = getInstanceOf<DataSource>(Di.DataSource);

    try {
        await dataSource.destroy();
    } catch (error) {
        log.error({
            error,
            message: `Failed to destroy connection!`,
            dependency: Dependency.TypeORM,
        });
    }
}
