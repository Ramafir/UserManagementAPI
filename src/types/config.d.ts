export interface IAppConfig {
    secret: string;
    env: string;
    port: number;
    url: string;
    frontendUrl: string | null;
}

export interface IDBDefineConfig {
    charset: string;
    collate: string;
    timestamps: boolean;
}

export interface IDBConfig {
    url: string;
    dialect: string;
    name: string | null;
    username: string | null;
    password: string | null;
    rootPassword: string | null;
    host: string | null;
    port: number;
    logging: ((message?: any, ...optionalParams: any[]) => void) | false;
    define: {
        charset: string;
        collate: string;
        timestamps: boolean;
    };
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
