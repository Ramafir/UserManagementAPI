import { Response } from 'express';
import { StatusCodes as HTTP } from 'http-status-codes';
import { IEntityMapperService } from 'types/services/IEntityMapperService';

import { Di } from '@enums/Di';
import { getInstanceOf } from '@helpers/getInstanceOf';

export abstract class BaseController {
    get mapper() {
        return getInstanceOf<IEntityMapperService>(Di.EntityMapperService);
    }

    protected finalizeRequest<T>(response: Response, code: HTTP, data?: T): Response {
        return data ? response.status(code).send(data) : response.status(code).send();
    }
}
