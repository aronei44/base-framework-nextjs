import { logger } from "./logger";

type AllType = string | number | boolean | object | null | undefined;

type SafeCall = {
    name?: string;
    tracer?: number;
    fn: () => Promise<AllType | void>;
}

type SafeCallFunction = (data: SafeCall) => Promise<{ data: AllType; tracer: number; }>;

const safecall : SafeCallFunction = async ({name, tracer, fn}) => {
    const startTimer = Date.now();
    let result: AllType | void = null;
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
            error,
            time: endTimer - startTimer,
            tracer
        });
    }
    return {
        data: result || null,
        tracer
    };
};

export default safecall;