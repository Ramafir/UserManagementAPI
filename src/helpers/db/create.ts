import mysql from 'mysql2/promise';
import { config as defaultConfig } from '@/config';
import type { IDBConfig } from '@/types/config';

const { app: { seedersLogging } } = defaultConfig;

export const create = async (config?: IDBConfig) => {
    if (seedersLogging) {
        console.log('Create script has started.');
    }

    const { username, password, rootPassword, name, host, port } = config || defaultConfig.db;

    console.log(`Connecting to ${host}:${port} on root user.`);

    const connection = await mysql.createConnection({
        host: host || 'localhost',
        user: 'root',
        password: rootPassword || '',
        port: port || 3306,
    });

    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${name}`);

    console.log(`Database ${name} has been created by root.`);

    await connection.execute(`CREATE USER IF NOT EXISTS '${username}'@'%' IDENTIFIED BY '${password}';`);

    await connection.execute(`GRANT ALL ON ${name}.* TO '${username}'@'%' WITH GRANT OPTION;`);

    await connection.execute('FLUSH PRIVILEGES;');

    if (seedersLogging) {
        console.log(`Access to database ${name} has been given to ${username} by root.`);
    }

    await connection.end();

    if (seedersLogging) {
        console.log('Create script has finished.');
    }
};
