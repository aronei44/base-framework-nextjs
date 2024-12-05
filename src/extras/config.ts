'use server'

const getConfig = async () => {
    return {
        JWT_SECRET: process.env.JWT_SECRET ?? 'defaultsecret',
        JWT_EXPIRE: process.env.JWT_EXPIRE ?? '3600',
    }
}

export default getConfig;