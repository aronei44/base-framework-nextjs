'use client';
import { Button } from "@/components";
import { AllType } from "@/extras/types";
import { useCallback, useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { DBFilter, DBPagination } from "@/data/types";
import Modal from "./formmodal";
import Header from "./header";
import { MetadataBuilderProps } from "../form/types";
import { RenderForm } from "../form";
import Loading from "./loading";
import { useAlert } from "@/extras/alertcontext";

type LayoutProps = {
    getData: (pagination?: DBPagination, filter?: DBFilter, tracer?: number) => Promise<{data: Record<string, AllType>[], total: number}>
    title: string
    columns: TableColumn<Record<string, unknown>>[]
    addState?: string
    filter?: MetadataBuilderProps
    form?: {
        getData: (data: Record<string, AllType>) => Promise<Record<string, AllType> | null>
    } & MetadataBuilderProps
    menu_id: string
}

const Layout = (props: LayoutProps) => {
    const alert = useAlert();
    const [data, setData] = useState<Record<string, AllType>[]>([]);
    const [pagination, setPagination] = useState<DBPagination>({ limit: 10, page: 1 });
    const [modalState, setModalState] = useState<{
        show: boolean;
        title: string;
        mode: string;
        state: string;
    }>({
        show: false,
        title: "",
        mode: "",
        state: ""
    });
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalData, setTotalData] = useState<number>(0);

    const getData = useCallback(async (pagination: DBPagination, filter: DBFilter = {}) => {
        setLoading(true);
        setPagination(pagination);
        const {data: dataDB, total} = await props.getData(pagination, filter);
        setData(dataDB);
        setTotalData(total);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        if ((pagination?.page || 0) > 1 && dataDB.length === 0) {
            getData({ ...pagination, page: 1 }, filter);
        }
    }, [props]);

    const resetFilter = () => {
        setPagination({ limit: 10, page: 1 });
        props.filter?.setFields({
            data: {},
            errors: {},
        })
        getData({
            limit: 10,
            page: 1
        });
    }

    const getOneData = async (data?: Record<string, AllType>) => {
        if (props.form && data) {
            const dataDB = await props.form.getData(data);
            if (dataDB) {
                props.form.setFields({
                    data: {
                        ...props.form.fields.data,
                        ...dataDB
                    },
                    errors: {}
                });
            } else {
                alert.swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Data tidak ditemukan'
                })
                setModalState({ ...modalState, show: false });
            }
        }
    }

    useEffect(() => {
        getData(pagination, props.filter?.fields.data as unknown as DBFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination, props.filter?.fields.data]);
    return (
        <div 
            className= "bg-white p-4 min-h-fit rounded-md shadow-lg" 
            onClick={() => setModalState({ ...modalState, show: false })}    
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
                            menu_id={props.menu_id}
                            state=""
                            mode="filter"
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
                        if (!loading) {
                            getData({ ...pagination, page: page }, props.filter?.fields.data as unknown as DBFilter);
                        }
                    }}
                    onChangeRowsPerPage={(currentRowsPerPage) => {
                        if (!loading) {
                            getData({ ...pagination, limit: currentRowsPerPage }, props.filter?.fields.data as unknown as DBFilter);
                        }
                    }}
                    paginationTotalRows={totalData}
                    actions={
                        props.addState && props.form && <Button 
                            key={1}
                            label={`+ Tambah ${props.addState}`}
                            color="green"
                            onClick={(e) => {
                                e.stopPropagation();
                                setModalState({ 
                                    title: `Tambah ${props.addState}`,
                                    show: true,
                                    mode: "add",
                                    state: ""
                                });
                                getOneData();
                            }}
                        />
                    }
                    progressPending={loading}
                    progressComponent={<Loading />}
                />
            </div>
            {modalState.show && props.form && (
                <Modal 
                    setOpen={(e)=> setModalState({ ...modalState, show: e })}    
                    title={modalState.title}
                    form={{
                        menu_id: props.menu_id,
                        mode: "add",
                        state: "",
                        ...props.form
                    }}
                />
            )}
         </div>
    )
}

export default Layout;