'use client';
import { TableColumn } from "react-data-table-component";
import { User } from "@/data/types";
import { MinimizeMetadaBuilderProps } from "@/components/form/types";
import { getRoles } from "@/data/role";

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

const filterMetadata : MinimizeMetadaBuilderProps = {
    cols: 3,
    content: [
        {
            name: 'username',
            type: 'text',
            dataType: 'string',
            setup: {
                type: 'text',
                label: 'Username',
                placeholder: 'Username',
            }
        }
    ]
}

const metadata : MinimizeMetadaBuilderProps = {
    cols: 4,
    content: [
        {
            name: 'username',
            type: 'text',
            dataType: 'string',
            setup: {
                label: 'Username',
                placeholder: 'Username',
            },
            validation(value, fields, validationFn) {
                return validationFn(value, { required: true });
            },
            disabled(fields, state) {
                return state !== 'useradd';
            },
        },
        {
            name: 'name',
            type: 'text',
            dataType: 'string',
            setup: {
                label: 'Name',
                placeholder: 'Name',
            }
        },
        {
            name: 'role_id',
            type: 'async-select',
            dataType: 'string',
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
                return state !== 'useradd';
            },
        },
        {
            name: 'password',
            type: 'text',
            dataType: 'string',
            setup: {
                label: 'Password',
                placeholder: 'Password',
            },
            hidden(fields, state) {
                return state !== 'useradd';
            },
            validation(value, fields, validationFn) {
                return validationFn(value, { required: true });
            },
        }
    ]
}

export { columns, filterMetadata, metadata };