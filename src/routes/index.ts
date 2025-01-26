import 'express-async-errors';

import { Router } from 'express';
import { readdir } from 'fs/promises';

export const getRouter = async () => {
    const router: Router = Router();

    const extension = __filename.split('.').pop() || 'ts';

    const loadRoutes = async (currentDirectory = '') => {
        const fsItems: string[] = await readdir(`${__dirname}${currentDirectory}`);

        for (const item of fsItems) {
            if (!item.includes('.')) {
                loadRoutes(`${currentDirectory}/${item}`);

                continue;
            }

            if (!item.endsWith(`.${extension}`)) {
                continue;
            }

            const [fileName] = item.split('.');

            if (fileName === 'index') {
                continue;
            }

            const isDefaultFile: boolean = fileName === 'default';

            const routePath = `${currentDirectory}/${fileName}`;

            const { router: singleRouter } = await import(`./${routePath}`);

            router.use(isDefaultFile ? currentDirectory : routePath, singleRouter);
        }
    };

    await loadRoutes();

    return router;
};
