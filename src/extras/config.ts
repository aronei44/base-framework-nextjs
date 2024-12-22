'use server'

const getConfig = async () => {
    return {
        JWT_SECRET: process.env.JWT_SECRET ?? 'defaultsecret',
        JWT_EXPIRE: process.env.JWT_EXPIRE ?? '3600',
        REDIS_HOST: process.env.REDIS_HOST ?? 'localhost',
        REDIS_PORT: process.env.REDIS_PORT ?? '6379',
        REDIS_PASSWORD: process.env.REDIS_PASSWORD ?? '',
        REDIS_DB: process.env.REDIS_DB ?? '0',
    }
}

export default getConfig;