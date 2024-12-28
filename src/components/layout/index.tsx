'use client';
import { Button } from "@/components";
import { AllType } from "@/extras/types";
import { useCallback, useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { DBFilter, DBPagination, MenuAction } from "@/data/types";
import Modal from "./formmodal";
import Header from "./header";
import { MetadataBuilderProps } from "../form/types";
import { RenderForm } from "../form";
import Loading from "./loading";
import { useAlert } from "@/extras/alertcontext";
import { getMenuAction } from "@/data/actionbutton";

type ActionCellProps = {
    row: Record<string, unknown>;
    index: number;
    tableActionMenu: MenuAction[];
    setModalState: (state: { show: boolean; title: string; mode: string; state: string }) => void;
    getOneData: (data: Record<string, AllType>) => void;
    setShowAction: (index: number | null) => void;
    showAction: number | null;
}

const ActionCell = (props: ActionCellProps) => (
    <div className="relative">
        <p
            className="bg-slate-50 px-4 py-2 rounded-md border border-slate-500 hover:bg-slate-200 cursor-pointer active:bg-slate-500"
            onClick={(e) => { 
                e.stopPropagation();
                props.setShowAction(props.index);
            }}
        >...</p>
        {props.showAction === props.index && (
            <div className="border border-slate-500 py-2 px-4 fixed z-[999] bg-white rounded-md">
                {props.tableActionMenu.map((action, idx) => (
                    <p
                        key={'action_' + idx}
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setModalState({
                                title: action.label,
                                show: true,
                                mode: action.action_id,
                                state: ""
                            });
                            props.getOneData(props.row as Record<string, AllType>);
                            props.setShowAction(null);
                        }}
                        className="my-2 cursor-pointer py-2 px-4 hover:bg-slate-50 rounded-md"
                    >
                        {action.label}
                    </p>
                ))}
            </div>
        )}
    </div>
);

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
    const [addActionMenu, setAddActionMenu] = useState<MenuAction[]>([]);
    const [tableActionMenu, setTableActionMenu] = useState<MenuAction[]>([]);
    const [columns, setColumns] = useState<TableColumn<Record<string, unknown>>[]>([]);
    const [showAction, setShowAction] = useState<number | null>(null);

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

    const getOneData = useCallback(async (data?: Record<string, AllType>) => {
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
    }, [props.form, alert.swal, modalState]);

    const getMenuActionList = useCallback(async () => {
        const [add, table] = await getMenuAction(props.menu_id);
        setAddActionMenu(add);
        setTableActionMenu(table);
    }, [props.menu_id]);

    const appendData = useCallback(() => {
        const actionColumns: TableColumn<Record<string, unknown>> = {
            name: "Action",
            cell: (row, index) => <ActionCell 
                row={row} 
                index={index} 
                tableActionMenu={tableActionMenu}
                setModalState={setModalState}
                getOneData={getOneData}
                setShowAction={setShowAction}
                showAction={showAction}
            />
        }

        setColumns([
            ...props.columns,
            actionColumns
        ]);
    }, [props.columns, tableActionMenu, getOneData, setModalState, showAction]);

    useEffect(() => {
        getMenuActionList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.menu_id, getMenuActionList]);

    useEffect(() => {
        getData(pagination, props.filter?.fields.data as unknown as DBFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination, props.filter?.fields.data]);

    useEffect(() => {
        setColumns(props.columns);
    }, [props.columns]);
    
    useEffect(() => {
        appendData();
    }, [props.columns, tableActionMenu, appendData]);

    return (
        <div 
            className= "bg-white p-4 min-h-fit rounded-md shadow-lg" 
            onClick={() => {
                setModalState({ ...modalState, show: false })
                setShowAction(null);
            }}    
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
                    columns={columns}
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
                        props.form && addActionMenu.map((action, index) => (
                            <Button 
                                key={'add_' + index}
                                label={action.label}
                                color="green"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setModalState({ 
                                        title: action.label,
                                        show: true,
                                        mode: action.action_id,
                                        state: ""
                                    });
                                    getOneData();
                                }}
                            />
                        ))
                    }
                    progressPending={loading}
                    progressComponent={<Loading />}
                />
            </div>
            {modalState.show && props.form && (
                <Modal 
                    setOpen={(e)=> {
                        props.form?.setFields({
                            data: {},
                            errors: {}
                        });
                        setModalState({ ...modalState, show: e })
                    }}    
                    title={modalState.title}
                    form={{
                        menu_id: props.menu_id,
                        mode: modalState.mode,
                        state: modalState.state,
                        ...props.form
                    }}
                />
            )}
         </div>
    )
}

export default Layout;