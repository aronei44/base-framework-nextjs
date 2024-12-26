'use client';
import { Button } from "@/components";
import { AllType } from "@/extras/types";
import { useCallback, useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { DBFilter, DBPagination } from "@/data/types";
import Modal from "./modal";
import Header from "./header";

type LayoutProps = {
    getData: (pagination?: DBPagination, filter?: DBFilter, tracer?: number) => Promise<Record<string, AllType>[]>
    title: string
    columns: TableColumn<Record<string, unknown>>[]
    addState?: string
}

const Layout = (props: LayoutProps) => {
    const [data, setData] = useState<Record<string, AllType>[]>([]);
    const [pagination, setPagination] = useState<DBPagination>({ limit: 10, page: 1 });
    const [modal, setModal] = useState<boolean>(false);
    const [modalState, setModalState] = useState<{
        title: string;
    }>({
        title: ""
    });

    const getData = useCallback(async () => {
        const dataDB = await props.getData(pagination);
        setData(dataDB);
    }, [props, pagination]);

    useEffect(() => {
        getData();
    }, [getData]);
    return (
        <div 
            className= "bg-white p-4 min-h-fit rounded-md shadow-lg" 
            onClick={() => setModal(false)}    
        >
            <Header
                title={props.title}
            />
            <div className="p-2 shadow-md rounded-md border-t border-t-gray-200">
                <DataTable
                    columns={props.columns}
                    data={data}
                    persistTableHead={true}
                    paginationServer={true}
                    pagination={true}
                    onChangePage={(page) => {
                        setPagination({ ...pagination, page: page });
                    }}
                    onChangeRowsPerPage={(currentRowsPerPage) => {
                        setPagination({ ...pagination, limit: currentRowsPerPage });
                    }}
                    actions={
                        props.addState && <Button 
                            key={1}
                            label={`+ Tambah ${props.addState}`}
                            color="green"
                            onClick={(e) => {
                                e.stopPropagation();
                                setModal(true);
                                setModalState({ title: `Tambah ${props.addState}` });
                            }}
                        />
                    }
                />
            </div>
            <Modal 
                isOpen={modal}
                setOpen={setModal}    
                title={modalState.title}
            >
                <h1>Modal</h1>
            </Modal>
         </div>
    )
}

export default Layout;