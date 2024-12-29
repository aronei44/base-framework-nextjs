'use client';
import Layout from "@/components/layout";
import { columns, filterMetadata, metadata } from "./metadata";
import { Fields } from "@/components/form/types";
import { useState } from "react";
import defaultFields from "@/extras/defaultfields";
import { getRole, getRoles } from "@/data/role";

const Role = () => {
    const [fields, setFields] = useState<Fields>(defaultFields)

    const [filter, setFilter] = useState<Fields>(defaultFields)
    return (
        <Layout
            columns={columns}
            getData={getRoles}
            title="Pengelolaan Role"
            addState="Role"
            key="role"
            menu_id="mnuADMRole"
            filter={{
                ...filterMetadata,
                fields: filter,
                setFields: setFilter,
            }}
            form={{
                ...metadata,
                fields: fields,
                setFields: setFields,
                getData: getRole
            }}
        />
    )
}

export default Role;