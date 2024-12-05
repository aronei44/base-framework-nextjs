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
            return jwt.sign(data, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRE });
        }
    }) as { data: string, tracer: number };
}

export const decrypt = async (token: string, tracer?: number) => {
    return await safecall({
        name: 'decrypt',
        tracer,
        fn: async () => {
            return jwt.verify(token, config.JWT_SECRET);
        }
    }) as { data: Record<string, AllType>, tracer: number };
}
