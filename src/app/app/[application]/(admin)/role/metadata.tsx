'use client';
import { TableColumn } from "react-data-table-component";
import { Role } from "@/data/types";
import { MinimizeMetadaBuilderProps } from "@/components/form/types";

const columns: TableColumn<Record<string, unknown>>[] = [
    {
        name: 'Role ID',
        selector: row => (row as Role).role_id,
        sortable: true,
    },
    {
        name: 'Role Name',
        selector: row => (row as Role).role_name,
        sortable: true
    },
    {
        name: 'Description',
        selector: row => (row as Role).description,
        sortable: true
    },
]

const filterMetadata : MinimizeMetadaBuilderProps = {
    cols: 3,
    content: [
        {
            name: 'role_name',
            type: 'text',
            dataType: 'string',
            setup: {
                type: 'text',
                label: 'Role Name',
                placeholder: 'Role Name',
            }
        }
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