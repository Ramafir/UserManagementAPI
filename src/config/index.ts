import colors from 'colors';
import { config as dotenvConfig } from 'dotenv';

import type { IConfig } from '@/types/config';

dotenvConfig({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const env = (key: string, defaultValue = '') =>
    process.env[key] || defaultValue;

const isEnabled = (key: string) => env(key) === 'true';

const parseUrl = (url: string) => (url.endsWith('/') ? url.slice(0, -1) : url);

const TEST_ENVIRONMENTS = ['test'];
const DEV_ENVIRONMENTS = ['dev', 'development'];
const PROD_ENVIRONMENTS = ['prod', 'production'];
const AVAILABLE_ENVIRONMENTS = [
    ...TEST_ENVIRONMENTS,
    ...DEV_ENVIRONMENTS,
    ...PROD_ENVIRONMENTS
];

const currentEnvironment = env('NODE_ENV');

if (!AVAILABLE_ENVIRONMENTS.includes(currentEnvironment)) {
    console.warn(
        colors.yellow(
            `NODE_ENV is incorrect. Should be one of: ${AVAILABLE_ENVIRONMENTS.join(', ')}.`
        )
    );
}

export const config: IConfig = {
    app: {
        env: currentEnvironment,
        isDev: DEV_ENVIRONMENTS.includes(currentEnvironment),
        isTest: TEST_ENVIRONMENTS.includes(currentEnvironment),
        isProduction: PROD_ENVIRONMENTS.includes(currentEnvironment),
        port: parseInt(env('PORT', '3000')),
        url: parseUrl(env('APP_URL', 'http://127.0.0.1:3000')),
        frontendUrl: parseUrl(env('FRONTEND_URL', 'http://127.0.0.1:8080')),
        corsSites: env('CORS_SITES'),
        seedersLogging: isEnabled('SEEDERS_LOGGING')
    },
    db: {
        dialect: env('DATABASE_DIALECT'),
        name: env('DATABASE_NAME'),
        username: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        rootPassword: env('DATABASE_ROOT_PASSWORD'),
        write: {
            host: env('DATABASE_HOST'),
            port: parseInt(env('DATABASE_PORT'))
        },
        read: [
            {
                host: env('DATABASE_HOST'),
                port: parseInt(env('DATABASE_PORT'))
            }
        ],
        logging: isEnabled('SEQUELIZE_LOGGING') ? console.log : false,
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            timestamps: false
        }
    }
};
