'use server';

import Redis from "ioredis";
import getConfig from "./config";
import { RedisType } from "./types";

const redis = async ({
    host,
    port,
    password,
    db
}: RedisType) => {
    const config = await getConfig();
    
    return new Redis({
        host: host || config.REDIS_HOST,
        port: port || parseInt(config.REDIS_PORT),
        password: password || config.REDIS_PASSWORD,
        db: db || parseInt(config.REDIS_DB)
    });

}

export default redis;