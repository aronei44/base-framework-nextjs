'use client';
import Layout from "@/components/layout";
import { getUsers, getUser } from "@/data/user";
import { columns, filterMetadata, metadata } from "./metadata";
import { Fields } from "@/components/form/types";
import { useState } from "react";
import defaultFields from "@/extras/defaultfields";

const User = () => {
    const [fields, setFields] = useState<Fields>(defaultFields)

    const [filter, setFilter] = useState<Fields>(defaultFields)
    return (
        <Layout
            columns={columns}
            getData={getUsers}
            title="Pengelolaan User"
            addState="User"
            key="user"
            menu_id="mnuADMUser"
            filter={{
                ...filterMetadata,
                fields: filter,
                setFields: setFilter,
            }}
            form={{
                ...metadata,
                fields: fields,
                setFields: setFields,
                getData: getUser
            }}
        />
    )
}

export default User;