'use client';
import { TableColumn } from "react-data-table-component";
import { Otorisasi } from "@/data/types";
import { MinimizeMetadaBuilderProps } from "@/components/form/types";

const columns: TableColumn<Record<string, unknown>>[] = [
    {
        name: 'ID',
        selector: row => (row as Otorisasi).id,
        sortable: true,
        width: '100px'
    },
    {
        name: 'Menu',
        selector: row => (row as Otorisasi).menu_name,
        sortable: true
    },
    {
        name: 'Action',
        selector: row => (row as Otorisasi).action_name,
        sortable: true
    },
    {
        name: 'State',
        selector: row => (row as Otorisasi).state_name,
        sortable: true
    },
    {
        name: 'Description',
        selector: row => (row as Otorisasi).description,
        sortable: true
    },
    {
        name: 'Created At',
        selector: row => (row as Otorisasi).created_at.toLocaleString(),
        sortable: true
    },
]

const filterMetadata : MinimizeMetadaBuilderProps = {
    cols: 3,
    content: [
        {
            name: 'start_date',
            type: 'date',
            dataType: 'string',
            setup: {
                type: 'date',
                label: 'Tanggal Mulai',
                placeholder: 'Tanggal Mulai',
            }
        },
        {
            name: 'end_date',
            type: 'date',
            dataType: 'string',
            setup: {
                type: 'date',
                label: 'Tanggal Akhir',
                placeholder: 'Tanggal Akhir',
            }
        },
    ]
}

const metadata : MinimizeMetadaBuilderProps = {
    cols: 3,
    content: [
        {
            name: 'role_id',
            type: 'text',
            dataType: 'string',
            required: true,
            setup: {
                type: 'text',
                label: 'Role ID',
                placeholder: 'Role ID',
            },
            validation(value, fields, validationFn) {
                return validationFn(value, { required: true });
            },
        },
        {
            name: 'role_name',
            type: 'text',
            dataType: 'string',
            required: true,
            setup: {
                type: 'text',
                label: 'Role Name',
                placeholder: 'Role Name',
            },
            validation(value, fields, validationFn) {
                return validationFn(value, { required: true });
            },
        },
        {
            name: 'description',
            type: 'text',
            dataType: 'string',
            setup: {
                type: 'text',
                label: 'Description',
                placeholder: 'Description',
            }
        }
    ]
}

export { columns, filterMetadata, metadata };