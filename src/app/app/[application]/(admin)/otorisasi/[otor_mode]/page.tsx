'use client';
import Layout from "@/components/layout";
import { columns, filterMetadata, metadata } from "./metadata";
import { Fields } from "@/components/form/types";
import { useEffect, useState } from "react";
import defaultFields from "@/extras/defaultfields";
import { useParams } from "next/navigation";
import { getOtorisasi, getOtorOne } from "@/data/otorisasi";
import { metadata as metadataUser } from "../../user/metadata";
import { metadata as metadataRole } from "../../role/metadata";
import { metadata as metadataApplication } from "../../apps/application/metadata";

const Otorisasi = () => {
    const param = useParams();
    const [fields, setFields] = useState<Fields>(defaultFields)

    const [filter, setFilter] = useState<Fields>(defaultFields)

    useEffect(() => {
        setFilter(prev => {
            return {
                ...prev,
                data: {
                    ...prev.data,
                    application: param.application,
                    history: param.otor_mode === 'histori'
                }
            }
        })
    }, [param.otor_mode, param.application])

    
    return (
        <Layout
            columns={columns}
            getData={getOtorisasi}
            title={`Pengelolaan ${param.otor_mode === 'approval' ? 'Otorisasi' : 'Histori Otorisasi'}`}
            addState="Otorisasi"
            key="otorisasi"
            menu_id={param.otor_mode === 'approval' ? 'mnuADMOtorAppr' : 'mnuADMOtorHist'}
            filter={{
                ...filterMetadata,
                fields: filter,
                setFields: setFilter,
            }}
            form={{
                ...metadata,
                fields: fields,
                setFields: setFields,
                getData: getOtorOne
            }}
            globalMetadata={{
                'mnuADMUser': metadataUser,
                'mnuADMRole': metadataRole,
                'mnuADMAppsApplication': metadataApplication
            }}
        />
    )
}

export default Otorisasi;