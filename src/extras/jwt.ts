'use server';

import jwt from 'jsonwebtoken';
import { AllType } from './types';
import safecall from './safecall';
import getConfig from './config';

const config = await getConfig();

export const encrypt = async (data: Record<string, AllType>, tracer?: number) => {
    return await safecall({
        name: 'encrypt',
        tracer,
        fn: async () => {
            // remove iat and exp from jwt
            const { iat, exp, ...payload } = data;
            console.log(`last iat: ${iat}, last exp: ${exp}`); // just for use the variables
            return jwt.sign(payload, config.JWT_SECRET, { expiresIn: parseInt(config.JWT_EXPIRE) });
        }
    }) as { data: string, tracer: number, error: boolean };
}

export const decrypt = async (token: string, tracer?: number) => {
    return await safecall({
        name: 'decrypt',
        tracer,
        fn: async () => {
            return jwt.verify(token, config.JWT_SECRET);
        }
    }) as { data: Record<string, AllType>, tracer: number, error: boolean };
}
