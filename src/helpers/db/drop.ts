import mysql from 'mysql2/promise';
import { config as defaultConfig } from '@/config';
import type { IDBConfig } from '@/types/config';

export const drop = async (config?: IDBConfig) => {
    console.log('Drop script has started.');

    const { name, host, port, rootPassword } = config || defaultConfig.db;

    const connection = await mysql.createConnection({
        host: host || 'localhost',
        user: 'root',
        password: rootPassword || 'root',
        port: port || 3306,
    });

    await connection.execute(`DROP DATABASE IF EXISTS ${name}`);

    console.log(`Database ${name} has been deleted by root.`);

    await connection.end();

    console.log('Drop script has finished.');
};
