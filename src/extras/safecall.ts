import { logger } from "./logger";
import { SafeCallFunction, AllType } from "./types";

const safecall : SafeCallFunction = async ({name, tracer, fn}) => {
    const startTimer = Date.now();
    let result: AllType = null;
    let success = true;
    let error: Error | null = null;
    try {
        result = await fn();
    } catch (e) {
        success = false;
        error = e as Error;
    } finally {
        const endTimer = Date.now();
        tracer = tracer ?? startTimer;
        logger.info({
            name,
            success,
            result,
            error: error?.message,
            executionTimeMS: endTimer - startTimer,
            tracer
        });
    }
    return {
        data: result || error,
        tracer,
        error: !success
    };
};

export default safecall;