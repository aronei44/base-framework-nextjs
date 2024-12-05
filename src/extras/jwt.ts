'use server';

import jwt from 'jsonwebtoken';
import { AllType } from './types';
import safecall from './safecall';
import getConfig from './config';

const config = await getConfig();

export const encrypt = async (data: Record<string, AllType>) => {
    const { data: token } = await safecall({
        name: 'encrypt',
        fn: async () => {
            return jwt.sign(data, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRE });
        }
    });
    return token as string;
}

export const decrypt = async (token: string) => {
    const { data: decoded } = await safecall({
        name: 'decrypt',
        fn: async () => {
            return jwt.verify(token, config.JWT_SECRET);
        }
    });
    return decoded as Record<string, AllType>;
}
