import dbconn from "./connection";
import { DBPagination, User } from "./types";
import { z } from "zod";


const UserCreateSchema = z.object({
    username: z.string().min(1),
    name: z.string().min(1),
    password: z.string().min(1)
});

const UserUpdateSchema = z.object({
    username: z.string().min(1),
    name: z.string().min(1),
});

const getUsers = async (pagination?: DBPagination, tracer?: number) => {
    const limit = pagination?.limit ?? 10;
    const page = pagination?.page ?? 1;
    const offset = (page - 1) * limit;
    const query = `SELECT * FROM users LIMIT ${limit} OFFSET ${offset}`;
    const {data, error} = await dbconn(query, tracer);
    if (error) {
        return [];
    }
    return data as User[];
}

const getUserById = async (username: string, tracer?: number) => {
    const query = `SELECT * FROM users WHERE username = '${username}'`;
    const {data, error} = await dbconn(query, tracer);
    if (error) {
        return null;
    }
    return data[0] as User;
}


const createUser = async (user: User, tracer?: number) => {
    const validationResult = await UserCreateSchema.safeParseAsync(user);
    if (!validationResult.success) {
        throw new Error(validationResult.error.errors[0].message);
    }
    const query = `INSERT INTO users (username, name, password) VALUES ('${user.username}', '${user.name}', '${user.password}')`;
    const {error} = await dbconn(query, tracer);
    return !error;
}

const updateUser = async (user: User, tracer?: number) => {
    const validationResult = await UserUpdateSchema.safeParseAsync(user);
    if (!validationResult.success) {
        throw new Error(validationResult.error.errors[0].message);
    }
    const query = `UPDATE users SET name = '${user.name}' WHERE username = '${user.username}'`;
    const {error} = await dbconn(query, tracer);
    return error;
}

const deleteUser = async (username: string, tracer?: number) => {
    const query = `DELETE FROM users WHERE username = '${username}'`;
    const {error} = await dbconn(query, tracer);
    return error;
}

const updateUserPassword = async (username: string, password: string, tracer?: number) => {
    const query = `UPDATE users SET password = '${password}' WHERE username = '${username}'`;
    const {error} = await dbconn(query, tracer);
    return error;
}

export {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    updateUserPassword
}

