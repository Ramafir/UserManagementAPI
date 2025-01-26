export interface IAppConfig {
    env: string;
    isDev: boolean;
    isTest: boolean;
    isProduction: boolean;
    port: number;
    url: string;
    frontendUrl: string;
    corsSites: string;
    seedersLogging: boolean;
}

export interface IDBDefineConfig {
    charset: string;
    collate: string;
    timestamps: boolean;
}

export interface IDBConfig {
    username: string;
    password: string;
    rootPassword: string;
    logging: false | Console['log'];
    define: IDBDefineConfig;
    dialect: string;
    name: string;
    write: IDBConnectionConfig;
    read: IDBConnectionConfig | IDBConnectionConfig[];
}

export interface ISessionConfig {
    secret: string;
}

export interface IRedisConfig {
    url: string;
    host: string;
    port: number;
    password: string;
    ttl: string;
}

export interface IConfig {
    app: IAppConfig;
    db: IDBConfig;
}
