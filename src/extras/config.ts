'use server'

const getConfig = async () => {
    return {
        JWT_SECRET: process.env.JWT_SECRET ?? 'defaultsecret',
        JWT_EXPIRE: process.env.JWT_EXPIRE ?? '3600',
        REDIS_HOST: process.env.REDIS_HOST ?? 'localhost',
        REDIS_PORT: process.env.REDIS_PORT ?? '6379',
        REDIS_PASSWORD: process.env.REDIS_PASSWORD ?? '',
        REDIS_DB: process.env.REDIS_DB ?? '0',
        DB_NAME: process.env.DB_NAME ?? 'mydb',
        DB_USER: process.env.DB_USER ?? 'postgres',
        DB_PASSWORD: process.env.DB_PASSWORD ?? 'postgres',
        DB_HOST: process.env.DB_HOST ?? 'localhost',
        DB_PORT: process.env.DB_PORT ?? '5432',
        DB_DIALECT: process.env.DB_DIALECT ?? 'postgres',
        SESSION_TIMEOUT: process.env.SESSION_TIMEOUT ?? '1800',
        USE_REDIS: process.env.USE_REDIS === 'true',
    }
}

export default getConfig;