'use server';
import dbconn from "./connection";
import { ActionButton, MenuAction } from "./types";
import { checkSession } from "@/extras/security";

const getMenuAction = async (menu_id: string, tracer?: number) => {
    await checkSession();
    const query = `
        SELECT
            ma.*
        FROM
            flow.menu_actions ma
        WHERE
            ma.menu_id = '${menu_id}'
            and ma.action_role = 'add'
        ;
    `
    const { data, error } = await dbconn(query, tracer);
    if (error) {
        return [[], []] as [MenuAction[], MenuAction[]];
    }
    const querytable = `
        SELECT
            ma.*
        FROM
            flow.menu_actions ma
        WHERE
            ma.menu_id = '${menu_id}'
            and ma.action_role = 'table'
        ;
    `
    const { data: datatable, error: errortable } = await dbconn(querytable, tracer);
    if (errortable) {
        return [data, []] as [MenuAction[], MenuAction[]];
    }
    return [data,datatable] as [MenuAction[],MenuAction[]];
}

const getActionButton = async (previous_state: string, action_id:string, role_id: string, tracer?: number) => {
    await checkSession();
    const query = `
        SELECT fs.* from
            flow.flow_states fs
        INNER JOIN
            flow.flows f
        ON
            f.flow_id = fs.flow_id
        INNER JOIN
            flow.menu_actions ma
        ON
            ma.flow_id = f.flow_id
        INNER JOIN
            flow.flow_state_roles fsr
        ON
            fsr.flow_state = fs.state_name
        WHERE
            fs.previous_state = '${previous_state}'
            and ma.action_id = '${action_id}'
            and fsr.role_id = '${role_id}'
        ;
    `
    const { data, error } = await dbconn(query, tracer);
    if (error) {
        return []
    }
    return data as ActionButton[];
}


export {
    getMenuAction,
    getActionButton
}