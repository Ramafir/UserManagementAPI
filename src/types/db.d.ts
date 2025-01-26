import type { Sequelize } from 'sequelize-typescript';
import type { FindOptions, CountOptions } from 'sequelize';

export interface IMigrationParams {
    context: Sequelize;
}

export interface FindAndCountOptions extends FindOptions, CountOptions {}
