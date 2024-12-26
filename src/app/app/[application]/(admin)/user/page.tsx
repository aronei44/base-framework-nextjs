'use client';
import Layout from "@/components/layout";
import { getUsers } from "@/data/user";
import { columns, metadata } from "./metadata";
import { Fields } from "@/components/form/types";
import { useState } from "react";

const User = () => {
    const [fields, setFields] = useState<Fields>({
        data: {},
        errors: {}
    })
    return (
        <Layout
            columns={columns}
            getData={getUsers}
            title="Pengelolaan User"
            addState="User"
            key="user"
            filter={{
                cols: 3,
                content: metadata,
                fields: fields,
                setFields: setFields,
                state: '',
                menu_id: 'USER',
                mode: 'filter'
            }}
        />
    )
}

export default User;