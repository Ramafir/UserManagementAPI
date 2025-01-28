import cors from 'cors';
import path from 'path';
import fs from 'fs-extra';
import helmet from 'helmet';
import { StatusCodes as HTTP } from 'http-status-codes';
import express, { Application, Request, Response, Router } from 'express';

import { APP } from '@config';

import { Dependency } from '@enums/Dependency';

export const setupExpress = async (app: Application) => {
    app.use(
        cors({
            credentials: false,
            origin: [APP.URL],
        })
    );

    app.use(express.json());

    app.use(helmet());

    app.use(APP.ROUTES_PREFIX, await getRoutes());

    app.use((request: Request, response: Response) => {
        return response.status(HTTP.INTERNAL_SERVER_ERROR).send('Oops.. Something broke 😢');
    });
};

async function getRoutes() {
    const routesDir = path.join(APP.BASE_DIR, 'routes');
    const mainRouter = Router();

    const routers = fs.readdirSync(routesDir);

    const registeredRouters: string[] = [];

    for (const routerFile of routers) {
        if (!routerFile.endsWith('.ts') && !routerFile.endsWith('.js')) {
            continue;
        }

        const routeName = path.basename(routerFile, path.extname(routerFile)); // Nazwa pliku bez rozszerzenia
        const routePath = path.resolve(routesDir, routerFile);

        try {
            const dependency = await import(routePath); // Importujemy plik routingu

            mainRouter.use(`/${routeName}`, dependency.default);

            registeredRouters.push(routeName);
        } catch (error) {
            console.error(`Failed to load route "${routeName}" from "${routePath}":`, error);
        }
    }

    log.debug({
        message: `Registered routes: \n${registeredRouters.join('\n')}`,
        dependency: Dependency.Express,
    });

    return mainRouter;
}
