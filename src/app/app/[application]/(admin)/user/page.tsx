'use client';
import Layout from "@/components/layout";
import { getUsers } from "@/data/user";
import { columns } from "./metadata";

const User = () => {
    return (
        <Layout
            columns={columns}
            getData={getUsers}
            title="Pengelolaan User"
            addState="User"
            key="user"
        />
    )
}

export default User;