'use client';
import { TableColumn } from "react-data-table-component";
import { Application } from "@/data/types";
import { MinimizeMetadaBuilderProps } from "@/components/form/types";
import { getRoles } from "@/data/role";

const columns: TableColumn<Record<string, unknown>>[] = [
    {
        name: 'App ID',
        selector: row => (row as Application).app_id,
        sortable: true,
    },
    {
        name: 'Nama Aplikasi',
        selector: row => (row as Application).app_name,
        sortable: true
    },
    {
        name: 'Deskripsi',
        selector: row => (row as Application).description,
        sortable: true
    },
]

const filterMetadata : MinimizeMetadaBuilderProps = {
    cols: 3,
    content: [
        {
            name: 'app_name',
            type: 'text',
            dataType: 'string',
            setup: {
                type: 'text',
                label: 'Nama Aplikasi',
                placeholder: 'Nama Aplikasi',
            }
        }
    ]
}

const metadata : MinimizeMetadaBuilderProps = {
    cols: 2,
    content: [
        {
            name: 'app_id',
            type: 'text',
            dataType: 'string',
            setup: {
                label: 'App ID',
                placeholder: 'App ID',
            },
            disabled: true,
        },
        {
            name: 'app_name',
            type: 'text',
            dataType: 'string',
            setup: {
                label: 'Nama Aplikasi',
                placeholder: 'Nama Aplikasi',
            },
            disabled: true,
        },
        {
            name: 'description',
            type: 'text',
            dataType: 'string',
            setup: {
                label: 'Deskripsi',
                placeholder: 'Deskripsi',
            },
            disabled: true,
        },
        {
            name: 'roles',
            type: 'async-select-multiple',
            dataType: 'array',
            setup: {
                label: 'Role',
                getData: getRoles,
                mapper: (data) => {
                    const result: Array<{value: string, label: string}> = [];
                    data.forEach((item) => {
                        result.push({
                            label: item.role_name as string,
                            value: item.role_id as string
                        })
                    }); 
                    return result;
                },
                searchKeyword: 'role_name',
            },
            validation(value, fields, validationFn) {
                return validationFn(value, { required: true });
            },
            disabled(fields, state) {
                return state !== 'appedit';
            },
            required: true,
        },
    ],
}

export { columns, filterMetadata, metadata };