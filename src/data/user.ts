'use server';
import dbconn from "./connection";
import { DBFilter, DBPagination, User } from "./types";
import { z } from "zod";


const UserCreateSchema = z.object({
    username: z.string().min(1),
    name: z.string().min(1),
    password: z.string().min(1),
    role: z.string().min(1),
});

const UserUpdateSchema = z.object({
    username: z.string().min(1),
    name: z.string().min(1),
});

const getUsers = async (pagination?: DBPagination, filter?: DBFilter, tracer?: number) => {
    const limit = pagination?.limit ?? 10;
    const page = pagination?.page ?? 1;
    const offset = (page - 1) * limit;
    let query = `
        SELECT
            u.username,
            u.name,
            json_build_object(
                'role_id', r.role_id, 
                'role_name', r.role_name
            ) as role
        FROM
            users u
        JOIN
            roles r
        ON
            u.role = r.role_id
    `

    if (filter?.username) {
        query += `WHERE u.username LIKE '%${filter.username}%'`
    }

    query += `LIMIT ${limit} OFFSET ${offset}`
    const {data, error} = await dbconn(query, tracer);
    if (error) {
        return {
            data: [],
            total: 0
        }
    }

    query = `SELECT COUNT(*) as total FROM users u`;
    const {data: dataTotal, error: errorTotal} = await dbconn(query, tracer);
    if (errorTotal) {
        return {
            data: data as User[],
            total: data.length
        }
    }

    return {
        data: data as User[],
        total: (dataTotal[0] as {total: number}).total
    }
}

const getUserById = async (username: string, tracer?: number) => {
    const query = `
        SELECT
            u.username,
            u.name,
            u.password,
            json_build_object(
                'role_id', r.role_id, 
                'role_name', r.role_name
            ) as role
        FROM
            users u
        JOIN
            roles r
        ON
            u.role = r.role_id
        WHERE
            u.username = '${username}'
    `
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
    const query = `INSERT INTO users (username, name, password, role) VALUES ('${user.username}', '${user.name}', '${user.password}', '${user.role_id}')`;
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

