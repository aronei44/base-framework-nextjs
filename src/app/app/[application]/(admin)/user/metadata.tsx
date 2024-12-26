'use client';
import { TableColumn } from "react-data-table-component";
import { User } from "@/data/types";
import { MetadataProps } from "@/components/form/types";

const columns: TableColumn<Record<string, unknown>>[] = [
    {
        name: 'User ID',
        selector: row => (row as User).username,
        sortable: true,
    },
    {
        name: 'Nama',
        selector: row => (row as User).name,
        sortable: true
    },
    {
        name: 'Role',
        selector: row => (row as User).role?.role_name as string,
        sortable: true
    },
]

const metadata : MetadataProps = [
    {
        name: 'username',
        type: 'text',
        setup: {
            type: 'text',
            label: 'Username',
            placeholder: 'Username',
        }
    }
]

export { columns, metadata };