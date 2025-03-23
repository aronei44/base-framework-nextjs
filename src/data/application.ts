'use server';
import dbconn from "./connection";
import { DBPagination, DBFilter, Application } from "./types";
import { AllType } from "@/extras/types";
import { z } from "zod";


const ApplicationUpdateSchema = z.object({
    app_id: z.string().min(1),
    roles: z.array(z.string().min(1)),
});


const getApplications = async (pagination?: DBPagination, filter?: DBFilter, tracer?: number) => {
    const limit = pagination?.limit ?? 10;
    const page = pagination?.page ?? 1;
    const offset = (page - 1) * limit;
    let query = `
        SELECT
            a.app_id,
            a.app_name,
            a.prefix,
            a.description,
            a.is_active,
            COALESCE(
                '[' || STRING_AGG(QUOTE_LITERAL(ara.role_id), ',') || ']',
                '[]'
            ) AS role_ids
        FROM application a
        LEFT JOIN app_role_access ara ON a.app_id = ara.app_id and ara.is_active = 't'
    `

    if (filter?.app_name) {
        filter.app_name = (filter.app_name as string).toLowerCase();
        query += `WHERE lower(a.app_name) LIKE '%${filter.app_name}%'`
    }

    query += `GROUP BY a.app_id, a.app_name, a.prefix, a.description, a.is_active LIMIT ${limit} OFFSET ${offset}`
    const { data, error } = await dbconn(query, tracer);
    if (error) {
        return {
            data: [],
            total: 0
        }
    }

    query = `SELECT COUNT(*) as total FROM application a`;
    const { data: dataTotal, error: errorTotal } = await dbconn(query, tracer);
    if (errorTotal) {
        return {
            data: data as Application[],
            total: data.length
        }
    }
    const newdata = (data as Application[]).map((d: Application) => {
        d.roles = JSON.parse((d.role_ids as string).replace(/'/g, '"'));
        delete d.role_ids;
        return d;
    });

    return {
        data: newdata,
        total: (dataTotal[0] as { total: number }).total
    }
}

const getApplication = async (data: Record<string, AllType>, tracer?: number) => {
    const query = `
        SELECT 
            a.app_id, 
            a.app_name, 
            a.prefix, 
            a.description, 
            CASE WHEN a.is_active THEN '1' ELSE '0' END AS is_active, 
            COALESCE(
                '[' || STRING_AGG(QUOTE_LITERAL(ara.role_id), ',') || ']', 
                '[]'
            ) AS role_ids
        FROM application a
        LEFT JOIN app_role_access ara ON a.app_id = ara.app_id and ara.is_active = 't'
        WHERE a.app_id = '${data.app_id}'
        GROUP BY a.app_id, a.app_name, a.prefix, a.description, a.is_active;
    `;
    const { data: appData, error } = await dbconn(query, tracer);
    if (error) {
        return null;
    }
    const ndata = appData[0] as Application;
    ndata.roles = JSON.parse((ndata.role_ids as string).replace(/'/g, '"'));
    delete ndata.role_ids;
    return ndata;
}


const checkApplication = async (data: Record<string, AllType>, action_id: string) => {

    const validationResult = await ApplicationUpdateSchema.safeParseAsync(data);
    if (!validationResult.success) {
        const err = validationResult.error.errors[0];
        return {
            success: false,
            message: `${err.path}: ${err.message}`
        }
    }

    const query = `SELECT * FROM application WHERE app_id = '${data.app_id}'`;
    const { data: appData, error } = await dbconn(query);
    if (error) {
        return {
            success: false,
            message: 'Error when checking application'
        }
    }
    if (action_id === 'appedit') {
        if (appData.length === 0) {
            return {
                success: false,
                message: 'Application not found'
            }
        }
        return {
            success: true,
            message: 'Application found'
        }
    }
    return {
        success: false,
        message: 'No action'
    }
}

const saveApplication = async (data: Record<string, AllType>, action_id: string) => {
    let query = `UPDATE app_role_access SET
        is_active = 'f'
        WHERE app_id = '${data.app_id}';
    `;
    if (action_id === 'appedit') {
        const roles = data.roles as string[];
        roles.forEach((role_id) => {
            query += `
                INSERT INTO "public"."app_role_access" ("app_id", "role_id", "is_active")
                VALUES ('${data.app_id}', '${role_id}', 't')
                ON CONFLICT ("app_id", "role_id") 
                DO UPDATE SET "is_active" = EXCLUDED."is_active";
            `;
        });
    }
    return query;
}


export {
    getApplications,
    getApplication,
    checkApplication,
    saveApplication
}