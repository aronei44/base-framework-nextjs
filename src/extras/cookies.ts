'use server';

import { cookies } from "next/headers";
import safecall from "./safecall";

const getCookies = async (key: string) => {
    const {data} = await safecall({
        name: "getCookies",
        fn: async () => {
            const cookie = await cookies();
            return cookie.get(key)?.value;
        }
    })
    return data;
};

export const setCookies = async (key: string, value: string) => {
    await safecall({
        name: "setCookies",
        fn: async () => {
            const cookie = await cookies();
            cookie.set(key, value);
        }
    })
};

export const removeCookies = async (key: string) => {
    await safecall({
        name: "removeCookies",
        fn: async () => {
            const cookie = await cookies();
            cookie.delete(key);
        }
    })
};

export default getCookies;