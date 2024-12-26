'use client';
import { Button } from "@/components";
import { AllType } from "@/extras/types";
import { useCallback, useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { DBFilter, DBPagination } from "@/data/types";
import Modal from "./modal";
import Header from "./header";
import { FormBuilderProps } from "../form/types";
import { RenderForm } from "../form";
import Loading from "./loading";

type LayoutProps = {
    getData: (pagination?: DBPagination, filter?: DBFilter, tracer?: number) => Promise<Record<string, AllType>[]>
    title: string
    columns: TableColumn<Record<string, unknown>>[]
    addState?: string
    filter?: FormBuilderProps
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
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const getData = useCallback(async () => {
        setLoading(true);
        const filter = props.filter?.fields?.data ?? {};
        const dataDB = await props.getData(pagination, filter as unknown as DBFilter);
        setData(dataDB);
        setLoading(false);
    }, [props, pagination]);

    const resetFilter = () => {
        setPagination({ limit: 10, page: 1 });
        props.filter?.setFields({
            data: {},
            errors: {},
        })
        getData();
    }

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

            {props.filter && (
                <div className="p-2 shadow-md rounded-md border-t border-t-gray-200 mt-16">
                    <div
                        className="flex justify-between mb-2 text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                        onClick={() => setShowFilter(!showFilter)}
                    >
                        <p>Filter:</p>
                        <p
                            onClick={(e)=> {
                                e.stopPropagation();
                                resetFilter();
                            }}
                        >
                            Reset Filter
                        </p>
                    </div>
                    <hr />
                    {showFilter && (
                        <RenderForm
                            {...props.filter}
                        />
                    )}
                </div>
            )}

            <div className="p-2 shadow-md rounded-md border-t border-t-gray-200 mt-16">
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
                    progressPending={loading}
                    progressComponent={<Loading />}
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