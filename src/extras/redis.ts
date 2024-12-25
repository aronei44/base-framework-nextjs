'use server';

import Redis from "ioredis";
import getConfig from "./config";
import { RedisType } from "./types";

const redis = async (conf?: RedisType) => {
    const config = await getConfig();
    
    return new Redis({
        host: conf?.host ?? config.REDIS_HOST,
        port: conf?.port ?? parseInt(config.REDIS_PORT),
        password: conf?.password ?? config.REDIS_PASSWORD,
        db: conf?.db ?? parseInt(config.REDIS_DB)
    });

}

export default redis;