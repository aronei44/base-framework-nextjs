'use server';

import jwt from 'jsonwebtoken';
import { AllType } from './types';
import safecall from './safecall';

const secret = process.env.JWT_SECRET ?? 'secret';
const expireIn = process.env.JWT_EXPIRE ?? '3600'; // 1 hour

export const encrypt = async (data: Record<string, AllType>) => {
    const { data: token } = await safecall({
        name: 'encrypt',
        fn: async () => {
            return jwt.sign(data, secret, { expiresIn: expireIn });
        }
    });
    return token as string;
}

export const decrypt = async (token: string) => {
    const { data: decoded } = await safecall({
        name: 'decrypt',
        fn: async () => {
            return jwt.verify(token, secret);
        }
    });
    return decoded as Record<string, AllType>;
}
