'use server';
import dbconn from "./connection";
import { Application } from "./types";


const getApplication = async (role_id: string, tracer?: number) => {
    const query = `
        SELECT 
            a.* 
        FROM 
            application a
        JOIN 
            app_role_access ara
        ON 
            a.app_id = ara.app_id
            and ara.role_id = '${role_id}'
            and ara.is_active = TRUE
        WHERE 
        a.is_active = TRUE;
    `
    const { data, error } = await dbconn(query, tracer);
    if (error) {
        return [];
    }
    return data as Application[];
}

export {
    getApplication
}