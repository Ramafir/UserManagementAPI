import type { Request } from 'express';
import type { User } from '@/models/User';

export interface ISequelizeFactoryOptions {
    dialect: string;
    database: string;
    username: string;
    password: string;
    writeOptions: IDBConnectionConfig;
    readOptions: IDBConnectionConfig | IDBConnectionConfig[];
    logging: false | Console['log'];
    define: IDBDefineConfig;
}

export interface IPatchDataItem<PROPERTY_TYPE> {
    op: 'replace';
    property: PROPERTY_TYPE;
    value: unknown;
}

export interface LoggedUserRequest extends Request {
    loggedUser: User;
}

export type IFilterType = 'substring' | 'eq' | 'in' | 'jsonOverlaps';

export interface IFilterValue {
    type: IFilterType;
    value: unknown;
}

export type IFilters = Record<string, IFilterValue>;

export interface IFindAllQuery {
    sortBy?: string;
    order?: string;
    q?: string;
    page?: string;
    perPage?: string;
    inactive?: string;
    filters?: string;
}

export interface IFindAllRequest extends LoggedUserRequest {
    query: IFindAllQuery;
}
