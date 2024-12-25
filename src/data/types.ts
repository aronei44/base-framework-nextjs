export type DBPagination = {
    limit?: number;
    page?: number;
}


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
