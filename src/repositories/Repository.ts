import deepmerge from 'deepmerge';
import { Inject, Service } from 'typedi';
import { Model, ModelCtor, Sequelize } from 'sequelize-typescript';
import {
    FindOptions,
    CountOptions,
    CreateOptions,
    UpdateOptions,
    DestroyOptions
} from 'sequelize';

import type { FindAndCountOptions } from '@/types/db';

@Service()
export abstract class Repository<M extends Model> {
    protected readonly deepmerge = deepmerge;

    constructor(
        @Inject('sequelize')
        readonly sequelize: Sequelize
    ) {}

    abstract get model(): ModelCtor;

    protected get repository() {
        return this.sequelize.getRepository(this.model);
    }

    findAll(options: FindOptions = {}) {
        return this.repository.findAll(options) as Promise<M[]>;
    }

    findAndCountAll(options: FindAndCountOptions = {}) {
        return this.repository.findAndCountAll(options) as Promise<{
            rows: M[];
            count: number;
        }>;
    }

    findOne(options: FindOptions = {}) {
        return this.repository.findOne(options) as Promise<M | null>;
    }

    findById(id: string | number, options: FindOptions = {}) {
        return this.repository.findByPk(id, options) as Promise<M | null>;
    }

    create(data: Record<string, unknown>, options: CreateOptions = {}) {
        return this.repository.create(data, options) as Promise<M>;
    }

    count(options: CountOptions = {}) {
        return this.repository.count(options);
    }

    random(options: FindOptions = {}) {
        return this.repository.findOne({
            ...options,
            order: this.sequelize.random()
        }) as Promise<M | null>;
    }

    manyRandom(limit = 1, options: FindOptions = {}) {
        return this.repository.findAll({
            ...options,
            order: this.sequelize.random(),
            limit
        }) as Promise<M[]>;
    }

    getTransaction() {
        return this.sequelize.transaction();
    }

    max(column: string, options: FindOptions = {}) {
        return this.repository.max(column, options);
    }

    update(data: Record<string, unknown>, options: UpdateOptions) {
        return this.repository.update(data, options);
    }

    destroy(options: DestroyOptions = {}) {
        return this.repository.destroy(options);
    }
}
