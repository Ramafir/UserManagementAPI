import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { ValidationError, UniqueConstraintError } from 'sequelize';

import { CORSError } from '@/errors/CORSError';
import { NonLoggedUserError } from '@/errors/NonLoggedUserError';
import { UnprocessableEntityError } from '@/errors/UnprocessableEntityError';

export const errorHandler = async (
    err: Error,
    request: Request,
    response: Response,
    // node requires 4 params in middlewares
    // eslint-disable-next-line
    next: NextFunction
) => {
    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
        const errors = err.errors.map(e => {
            return { message: e.message, param: e.path };
        });

        return response.status(StatusCodes.UNPROCESSABLE_ENTITY).send({ errors });
    }

    if (err instanceof CORSError) {
        return response.send({ message: err.message });
    }

    if (err instanceof UnprocessableEntityError) {
        const data: Record<string, string> = {};

        const { code, message } = err;

        if (code) {
            data.code = code;
        }

        if (message) {
            data.message = message;
        }

        return response.status(StatusCodes.UNPROCESSABLE_ENTITY).send(data);
    }

    console.error(err);

    if (err instanceof NonLoggedUserError) {
        return response.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send('We messed something up. Sorry!');
};
