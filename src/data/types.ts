export type DBPagination = {
    limit?: number;
    page?: number;
}


export type User = {
    username: string;
    name: string;
    password?: string;
    role: string;
}   