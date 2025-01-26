import 'reflect-metadata';
import 'module-alias/register';

import { getApp } from '@/index';
import { config } from '@/config';
import { shutdown } from '@/plugins/shutdown';

process.on('SIGINT', () => shutdown(true));
process.on('SIGTERM', () => shutdown(true));
process.on('exit', () => shutdown(true));

const runServer = async () => {
    const app = await getApp();

    const {
        app: { port }
    } = config;

    app.listen(port, (): void => {
        console.log(`Server is running at http://127.0.0.1:${port}`);
    });
};

runServer();
