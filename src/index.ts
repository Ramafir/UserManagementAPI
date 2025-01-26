import path from 'path';
import helmet from 'helmet';
import express, { Express, json, static as expressStatic } from 'express';

import { config } from '@/config';
import { getRouter } from '@/routes';
import { corsPlugin } from '@/plugins/cors';
import { processType } from '@/helpers/factories';
import { errorHandler } from '@/plugins/errorHandler';
import { initFactories } from '@/plugins/initFactories';

export const getApp = async () => {
    await initFactories(processType.Api);

    const {
        app: { isProduction, url }
    } = config;

    const app: Express = express();

    if (isProduction && url.startsWith('https')) {
        app.set('trust proxy', 1);
    }

    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    'frame-ancestors': ["'self'", config.app.frontendUrl]
                }
            }
        })
    );
    app.use(corsPlugin);

    app.use((req, res, next) => {
        json()(req, res, next);
    });

    const router = await getRouter();

    app.use('/api', router);

    app.use('/public', expressStatic(path.join(__dirname, './../storage/public')));

    app.use(errorHandler);

    return app;
};
