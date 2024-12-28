'use client';
import Layout from "@/components/layout";
import { getUsers, getUser } from "@/data/user";
import { columns, filterMetadata, metadata } from "./metadata";
import { Fields } from "@/components/form/types";
import { useState } from "react";

const User = () => {
    const [fields, setFields] = useState<Fields>({
        data: {},
        errors: {}
    })

    const [filter, setFilter] = useState<Fields>({
        data: {},
        errors: {}
    })
    console.log({filter})
    return (
        <Layout
            columns={columns}
            getData={getUsers}
            title="Pengelolaan User"
            addState="User"
            key="user"
            filter={{
                cols: 3,
                content: filterMetadata,
                fields: filter,
                setFields: setFilter,
                state: '',
                menu_id: 'USER',
                mode: 'filter'
            }}
            form={{
                cols: 3,
                content: metadata,
                fields: fields,
                setFields: setFields,
                state: '',
                menu_id: 'USER',
                mode: 'filter',
                getData: getUser
            }}
        />
    )
}

export default User;