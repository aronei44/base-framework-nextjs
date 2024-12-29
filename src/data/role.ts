'use server';
import dbconn from "./connection";
import { DBPagination, DBFilter, Role } from "./types";
import { AllType } from "@/extras/types";
import { z } from "zod";

const RoleCreateSchema = z.object({
    role_id: z.string().min(1),
    role_name: z.string().min(1),
});

const RoleUpdateSchema = z.object({
    role_id: z.string().min(1),
    role_name: z.string().min(1),
});


const getRoles = async (pagination?: DBPagination, filter?: DBFilter, tracer?: number) => {
    const limit = pagination?.limit ?? 10;
    const page = pagination?.page ?? 1;
    const offset = (page - 1) * limit;
    let query = `
        SELECT
            r.*
        FROM
            roles r
    `

    if (filter?.role_name) {
        query += `WHERE r.role_name LIKE '%${filter.role_name}%'`
    }

    query += `LIMIT ${limit} OFFSET ${offset}`
    const { data, error } = await dbconn(query, tracer);
    if (error) {
        return {
            data: [],
            total: 0
        }
    }

    query = `SELECT COUNT(*) as total FROM roles r`;
    const { data: dataTotal, error: errorTotal } = await dbconn(query, tracer);
    if (errorTotal) {
        return {
            data: data as Role[],
            total: data.length
        }
    }

    return {
        data: data as Role[],
        total: (dataTotal[0] as { total: number }).total
    }
}

const getRole = async (data: Record<string, AllType>, tracer?: number) => {
    const query = `SELECT * FROM roles WHERE role_id = '${data.username}'`;
    const { data: userData, error } = await dbconn(query, tracer);
    if (error) {
        return null;
    }
    return userData[0] as Role;
}

const checkRole = async (data: Record<string, AllType>, action_id: string) => {

    if (action_id === 'roleadd') {
        const validationResult = await RoleCreateSchema.safeParseAsync(data);
        if (!validationResult.success) {
            return {
                success: false,
                message: validationResult.error.errors[0].message
            }
        }
    } else {
        const validationResult = await RoleUpdateSchema.safeParseAsync(data);
        if (!validationResult.success) {
            return {
                success: false,
                message: validationResult.error.errors[0].message
            }
        }
    }

    const query = `SELECT * FROM roles WHERE role_id = '${data.role_id}'`;
    const { data: roleData, error } = await dbconn(query);
    if (error) {
        return {
            success: false,
            message: 'Error when checking role'
        }
    }
    if (roleData.length === 0) {
        return {
            success: action_id === 'roleadd',
            message: 'Role not found'
        }
    }
    return {
        success: action_id !== 'roleadd',
        message: 'Unique Exists'
    }
}

const saveRole = async (data: Record<string, AllType>, action_id: string) => {
    let query = '';
    if (action_id === 'roleadd') {
        query = `INSERT INTO roles (role_id, role_name) VALUES ('${data.role_id}', '${data.role_name}')`;
    } else {
        query = `UPDATE roles SET role_name = '${data.role_name}' WHERE role_id = '${data.role_id}'`;
    }
    return query;
}

export {
    getRoles,
    getRole,
    checkRole,
    saveRole
}