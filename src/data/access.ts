'use server';
import dbconn from "./connection";
import { Application, Menu } from "./types";


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

const getMenuParsed = (data: Menu[], parent_id: string | null = null) => {
    const result: Menu[] = [];
    data.forEach((menu) => {
        if (menu.parent_id === parent_id) {
            const childs = getMenuParsed(data, menu.menu_id);
            if (childs.length > 0) {
                menu.childs = childs;
            }
            result.push(menu);
        }
    });
    return result;
}

const getMenu = async (role_id: string, app_id: string, tracer?: number) => {
    const query = `
        SELECT 
            m.* 
        FROM 
            menus m
        JOIN 
            menu_roles mr
        ON 
            m.menu_id = mr.menu_id
            and mr.role_id = '${role_id}'
            and mr.is_active = TRUE
        WHERE 
            m.is_active = TRUE
            and m.app_id = '${app_id}';
    `
    const { data, error } = await dbconn(query, tracer);
    if (error) {
        return [];
    }
    return getMenuParsed(data as Menu[]);
}

export {
    getApplication,
    getMenu
}