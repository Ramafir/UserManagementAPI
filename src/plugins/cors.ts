import cors, { CorsOptions } from 'cors';

import { config } from '@/config';
import { CORSError } from '@/errors/CORSError';

const {
    app: { url, frontendUrl, adminUrl, corsSites }
} = config;

const whitelist: string[] = corsSites.split(',').map(site => site.trim());
const originsWhitelist: string[] = [url, frontendUrl, adminUrl, ...whitelist];

const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if (!origin || originsWhitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new CORSError());
        }
    },
    credentials: true,
    exposedHeaders: ['csrf-token']
};

export const corsPlugin = cors(corsOptions);
