'use server';
import bcrypt from "bcrypt";
import { getUserById, createUser } from "@/data/user"
import { getCookies, removeCookies, setCookies } from "./cookies";
import redis from "./redis";
import safecall from "./safecall";
import { User } from "@/data/types";
import getConfig from "./config";

import { createHash, createHmac } from 'crypto';
import { decrypt, encrypt } from "./jwt";

const securityRedisOptions = {
    db: 1
}

const encodeSignature = (username: string, secret: string) => {
    const encoder = new TextEncoder();
    const dbody = createHash('sha256').update(encoder.encode(username)).digest('hex');
    const dsig = encoder.encode(dbody);
    const signature = createHmac('sha512', secret);
    const signed = signature.update(dsig).digest('hex');
    const final = createHash('sha256').update(signed).digest('hex');
    return final;
}

const login = async (username: string, password: string) => {
    return await safecall({
        name: 'login',
        fn: async (tracer) => {
            const config = await getConfig();
            const user = await getUserById(username, tracer);
            if (!user) {
                return {success: false, message: 'User not found'};
            }
            const match = await bcrypt.compare(password, user.password as string);
            if (!match) {
                return {success: false, message: 'Invalid password'};
            }
            const id = user.username + "-" + encodeSignature(user.username, config.JWT_SECRET);
            const userdata = user;
            delete userdata.password;
            const userjwt = await encrypt(userdata, tracer);
            await (await redis(securityRedisOptions)).set(id, userjwt.data, 'EX', parseInt(config.SESSION_TIMEOUT));
            const cookies = await setCookies('session', id, tracer);
            if (cookies.error) {
                return {success: false, message: 'Error setting cookie'};
            }
            return {success: true, message: 'Login successful'};
        }
    }) as {
        data: {
            success: boolean;
            message: string;
        },
        error: boolean;
        tracer: number;
    }
}

const register = async (user: User) => {
    return await safecall({
        name: 'register',
        fn: async (tracer) => {
            const usr = await getUserById(user.username, tracer);
            if (usr) {
                return {success: false, message: 'User already exists'};
            }
            const hash = await bcrypt.hash(user.password as string, 10);
            const success = await createUser({username: user.username, name: user.name, password: hash, role_id: user.role_id as string}, tracer);
            return {success, message: success ? 'User created' : 'Error creating user'};
        }
    }) as {
        data: {
            success: boolean;
            message: string;
        },
        error: boolean;
        tracer: number;
    }
}

const checkSession = async () => {
    return await safecall({
        name: 'checkSession',
        fn: async (tracer) => {
            const config = await getConfig();
            const session = await getCookies('session', tracer);
            if (session.error) {
                return {success: false, message: 'No session found'};
            }
            const data = await (await redis(securityRedisOptions)).get(session.data);
            if (!data) {
                await removeCookies('session', tracer);
                return {success: false, message: 'Invalid session'};
            }
            const user = await decrypt(data, tracer);
            if (user.error) {
                await (await redis(securityRedisOptions)).del(session.data);
                await removeCookies('session', tracer);
                return {success: false, message: 'Invalid session'};
            } else {
                const newdata = await encrypt(user.data, tracer);
                await (await redis()).set(session.data, newdata.data, 'EX', parseInt(config.SESSION_TIMEOUT));
                await setCookies('session', session.data, tracer);
                return {success: true, message: 'Session valid', data: user.data};
            }
        }
    }) as {
        data: {
            success: boolean;
            message: string;
            data?: User;
        },
        error: boolean;
        tracer: number;
    }
}

const logout = async () => {
    return await safecall({
        name: 'logout',
        fn: async (tracer) => {
            const session = await getCookies('session', tracer);
            if (session.error) {
                return {success: false, message: 'No session found'};
            }
            await (await redis(securityRedisOptions)).del(session.data);
            await removeCookies('session', tracer);
            return {success: true, message: 'Session deleted'};
        }
    }) as {
        data: {
            success: boolean;
            message: string;
        },
        error: boolean;
        tracer: number;
    }
}

export {
    login,
    register,
    checkSession,
    logout
}