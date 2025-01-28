import http from 'http';
import { Express } from 'express';
import { Server } from 'engine.io';

import { APP } from '@config';

import { Dependency } from '@enums/Dependency';

export const attachEngineIO = (app: Express) => {
    const serverInstance = http.createServer(app);

    log.debug({
        dependency: Dependency.EngineIO,
        message: `Initializing server..`,
    });

    const engineIO = new Server({
        cors: {
            origin: [APP.URL],
            credentials: true,
        },
    });

    engineIO.attach(serverInstance);

    return {
        engineIO,
        serverInstance,
    };
};
