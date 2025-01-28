import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const STATIC_TOKEN = process.env.AUTH_TOKEN;

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!STATIC_TOKEN) {
        console.error('AUTH_TOKEN is not defined in the .env file.');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!authHeader || authHeader !== `Bearer ${STATIC_TOKEN}`) {
        return res.status(401).json({ error: 'Unauthorized. Invalid or missing token.' });
    }

    next();
};
