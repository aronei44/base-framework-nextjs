'use client';
import Layout from "@/components/layout";
import { getApplications, getApplication } from "@/data/application";
import { columns, filterMetadata, metadata } from "./metadata";
import { Fields } from "@/components/form/types";
import { useState } from "react";
import defaultFields from "@/extras/defaultfields";

const Application = () => {
    const [fields, setFields] = useState<Fields>(defaultFields)

    const [filter, setFilter] = useState<Fields>(defaultFields)
    return (
        <Layout
            columns={columns}
            getData={getApplications}
            title="Pengelolaan Aplikasi - Role"
            addState="Application"
            key="application"
            menu_id="mnuADMAppsApplication"
            filter={{
                ...filterMetadata,
                fields: filter,
                setFields: setFilter,
            }}
            form={{
                ...metadata,
                fields: fields,
                setFields: setFields,
                getData: getApplication
            }}
        />
    )
}

export default Application;