'use server';
import dbconn from "./connection";
import { DBPagination, DBFilter, Otorisasi } from "./types";
import { AllType } from "@/extras/types";


const getOtorisasi = async (pagination?: DBPagination, filter?: DBFilter, tracer?: number) => {
    const limit = pagination?.limit ?? 10;
    const page = pagination?.page ?? 1;
    const offset = (page - 1) * limit;
    const application = filter?.application ?? 'admin';
    const history = filter?.history ?? false;
    const start_date = filter?.start_date ?? ''; // yyyy-mm-dd
    const end_date = filter?.end_date ?? '';  // yyyy-mm-dd
    let query = `
        SELECT
            DISTINCT ON (fd.id)
            fd.id,
            fd.menu_id,
            (
                SELECT
                    m.menu_name
                FROM
                    "public".menus m
                WHERE
                    m.menu_id = fd.menu_id
            ) as menu_name,
            fd.action_id,
            (
                SELECT
                    ma.label
                from
                    flow.menu_actions ma
                WHERE
                    ma.action_id = fd.action_id
            ) as action_name,
            fd.state_name,
            fd.description,
            fd.created_at
        FROM
            flow.flow_data fd
        JOIN
            flow.flow_states fs
        ON
            fd.next_state = fs.previous_state
    `
    let whereClause = `
        WHERE
            fs.is_readonly = true
            AND fd.app_id = '${application}'
    `;

    if (!history) {
        whereClause += 'AND fd.final_state_at IS NULL '
    } else {
        whereClause += 'AND fd.final_state_at IS NOT NULL '
    }

    if (start_date) {
        whereClause += `AND fd.created_at >= '${start_date}' `
    }

    if (end_date) {
        whereClause += `AND fd.created_at <= '${end_date}' `
    }

    query += whereClause;

    query += `ORDER BY fd.id DESC LIMIT ${limit} OFFSET ${offset}`
    const { data, error } = await dbconn(query, tracer);
    if (error) {
        return {
            data: [],
            total: 0
        }
    }

    query = `
        SELECT DISTINCT ON (fd.id) COUNT(*) as total
        FROM flow.flow_data fd 
        JOIN flow.flow_states fs ON fd.next_state = fs.previous_state 
    `;
    query += whereClause;

    const { data: dataTotal, error: errorTotal } = await dbconn(query, tracer);
    if (errorTotal) {
        return {
            data: data as Otorisasi[],
            total: data.length
        }
    }

    return {
        data: data as Otorisasi[],
        total: (dataTotal[0] as { total: number }).total
    }
}

const getOtorOne = async (data: Record<string, AllType>, tracer?: number) => {
    const query = `
        SELECT
            fd.*
        FROM
            flow.flow_data fd
        WHERE
            fd.id = ${data.id}
    `;
    const { data: userData, error } = await dbconn(query, tracer);
    if (error) {
        return null;
    }
    return userData[0] as Otorisasi;
}

export {
    getOtorisasi,
    getOtorOne
}