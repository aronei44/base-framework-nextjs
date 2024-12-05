'use server';

import { cookies } from "next/headers";
import safecall from "./safecall";

export const getCookies = async (key: string, tracer?: number) => {
    return await safecall({
        name: "getCookies",
        tracer,
        fn: async () => {
            const cookie = await cookies();
            return cookie.get(key)?.value;
        }
    }) as {
        data: string,
        tracer: number,
        error: boolean
    }
};

export const setCookies = async (key: string, value: string, tracer?: number) => {
    return await safecall({
        name: "setCookies",
        tracer,
        fn: async () => {
            const cookie = await cookies();
            cookie.set(key, value);
        }
    })
};

export const removeCookies = async (key: string, tracer?: number) => {
    return await safecall({
        name: "removeCookies",
        tracer,
        fn: async () => {
            const cookie = await cookies();
            cookie.delete(key);
        }
    })
};
