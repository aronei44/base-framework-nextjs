import conn from "@/extras/db";
import { logger } from "@/extras/logger";
import safecall from "@/extras/safecall";

const dbconn = async (query: string, tracer?: number) => {

    return await safecall({
        name: 'dbconn',
        tracer,
        fn: async (tracer) => {
            const db = await conn();
            logger.info({
                name: 'dbconn',
                query,
                tracer
            });
            const [result] = await db.query(query);
            return result;
        }
    }) as { data: unknown[], tracer: number, error: false } | { data: Error, tracer: number, error: true };
}

export default dbconn;