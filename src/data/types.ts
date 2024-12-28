import { ButtonProps } from "@/components/form/types";

export type DBPagination = {
    limit?: number;
    page?: number;
}

export type DBFilter = Record<string, string | number | boolean>;

export type User = {
    username: string;
    name: string;
    password?: string;
    role?: {
        role_id: string;
        role_name: string;
    };
    role_id?: string;
}   

export type Application = {
    app_id: string;
    app_name: string;
    description: string;
    prefix: string;
    is_active: boolean;
}

export type Menu = {
    menu_id: string;
    menu_name: string;
    app_id: string;
    url: string;
    parent_id?: string;
    is_active: boolean;
    menu_order: number;
    childs?: Menu[];
}

export type MenuAction = {
    action_id: string;
    menu_id: string;
    action_role: string;
    flow_id: string;
    label: string;
}

export type ActionButton = {
    state_name: string;
    is_readonly: boolean;
    is_final: boolean;
    previous_state: string | null;
    next_state: string;
    description: string;
    flow_id: string;
    button_style: ButtonProps['color'];
}