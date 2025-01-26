import colors from 'colors';
import { config as dotenvConfig } from 'dotenv';

import type { IConfig } from '@/types/config';

dotenvConfig({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const env = (key: string, defaultValue = '') =>
    process.env[key] || defaultValue;

const isEnabled = (key: string) => env(key) === 'true';

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
        secret: env('APP_SECRET'),
        env: env('NODE_ENV'),
        url: env('APP_URL', 'http://localhost:3001') || 'http://localhost:3001',
        port: parseInt(env('PORT', '3001') || '3001', 10),
        frontendUrl: env('APP_FRONTEND_URL')
    },
    db: {
        url:
            env('DATABASE_DIALECT', 'mysql') +
            '://' +
            env('DATABASE_USERNAME', 'guest') +
            ':' +
            env('DATABASE_PASSWORD', 'guest') +
            '@' +
            env('DATABASE_HOST', 'localhost') +
            ':' +
            env('DATABASE_PORT', '3306') +
            '/' +
            env('DATABASE_NAME', 'db'),
        host: env('DATABASE_HOST', 'localhost') || 'localhost',
        name: env('DATABASE_NAME'),
        username: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        rootPassword: env('DATABASE_ROOT_PASSWORD', 'root') || 'root',
        dialect: env('DATABASE_DIALECT', 'mysql') || 'mysql',
        port: parseInt(env('DATABASE_PORT', '3306') || '3306', 10),
        logging: isEnabled('SEQUELIZE_LOGGING') ? console.log : false,
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            timestamps: false
        }
    },
};
