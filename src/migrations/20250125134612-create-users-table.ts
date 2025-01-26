import { DataType, Sequelize } from 'sequelize-typescript';

import { config } from '@/config';

import type { IMigrationParams } from '@/types/db';

const {
    db: { define }
} = config;

export const up = async ({ context: sequelize }: IMigrationParams) => {
    const queryInterface = sequelize.getQueryInterface();

    console.log('Creating table Users...');

    await queryInterface.createTable(
        'Users',
        {
            id: {
                type: DataType.UUID,
                defaultValue: DataType.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            email: {
                type: DataType.STRING,
                unique: true,
                allowNull: false
            },
            firstName: {
                type: DataType.STRING
            },
            lastName: {
                type: DataType.STRING
            },
            role: {
                type: DataType.STRING
            },
            createdAt: {
                type: DataType.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('NOW()')
            },
            updatedAt: {
                type: DataType.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('NOW()')
            },
            deletedAt: {
                type: DataType.DATE
            }
        },
        { ...define }
    );
};

console.log('Table Users created.');

export const down = async ({ context: sequelize }: IMigrationParams) => {
    const queryInterface = sequelize.getQueryInterface();

    await queryInterface.dropTable('Users');
};
