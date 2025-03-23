'use client';
import { Button } from "@/components";
import { AllType } from "@/extras/types";
import { useCallback, useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { ActionButton, DBFilter, DBPagination, MenuAction } from "@/data/types";
import Modal from "./formmodal";
import Header from "./header";
import { RenderForm } from "../form";
import Loading from "./loading";
import { useAlert } from "@/extras/alertcontext";
import { getMenuAction } from "@/data/actionbutton";
import { LayoutProps } from "./types";
import ActionCell from "./actioncell";
import defaultFields from "@/extras/defaultfields";
import { saveData } from "@/data/flow";
import { useAuth } from "@/extras/authcontext";
import { MinimizeMetadaBuilderProps } from "../form/types";


const Layout = (props: LayoutProps) => {
    const alert = useAlert();
    const auth = useAuth();
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
    const [metadata, setMetadata] = useState<MinimizeMetadaBuilderProps | null>(null);
    const [otorFields, setOtorFields] = useState<{
        flow_id?: number;
        flow_state: string;
        flow_action: string;
        flow_menu: string;
    }>({
        flow_state: '',
        flow_action: '',
        flow_menu: ''
    });

    const getData = useCallback(async (pagination: DBPagination, filter: DBFilter = {}) => {
        setLoading(true);
        setPagination(pagination);
        const {data: dataDB, total} = await props.getData(pagination, filter);
        setData(dataDB);
        setTotalData(total);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        if ((pagination?.page ?? 0) > 1 && dataDB.length === 0) {
            getData({ ...pagination, page: 1 }, filter);
        }
    }, [props]);

    const resetFilter = () => {
        setPagination({ limit: 10, page: 1 });
        props.filter?.setFields(defaultFields)
        getData({
            limit: 10,
            page: 1
        });
    }
    const submitForm = async (data: ActionButton) => {
        let fields = props.form?.fields ?? defaultFields;
        if (props.form?.onBeforeSubmit) {
            fields = props.form?.onBeforeSubmit(fields)
        }
        if (data.is_must_valid && Object.keys(fields.errors).length > 0) {
            let text = ''
            for (const key in fields.errors) {
                if (![undefined, null, ''].includes(fields.errors[key])) {
                    text += `<p>${key}: ${fields.errors[key]}</p>`
                }
            }
            if (text !== '') {
                alert.swal.fire({
                    title: 'Error Validation',
                    html: text,
                    icon: 'error'
                })
                return
            }
        }

        const remark = await alert.swal.fire({
            title: "Konfirmasi",
            text: "Keterangan",
            icon: "info",
            showCancelButton: true,
            input: "text",
            inputPlaceholder: "Keterangan",
        });

        const { data: dataRes, error} = await saveData(
                                                fields.data, 
                                                data, 
                                                props.globalMetadata ? otorFields.flow_menu : props.menu_id, 
                                                props.globalMetadata ? otorFields.flow_action : modalState.mode, 
                                                auth.state.param.application as string, 
                                                remark.value ?? '', 
                                                otorFields.flow_id
                                            );
        if (error || (dataRes as {
            success: boolean,
            message: string
        }).success === false) {
            alert.swal.fire({
                title: 'Error',
                text: (dataRes as {
                    success: boolean,
                    message: string
                }).message,
                icon: 'error'
            })
            return
        }

        alert.swal.fire({
            title: 'Success',
            html: `<p>Data has been submitted. <br/> '${data.description}'</p>`,
            icon: 'success'
        })

        props.form?.setFields(defaultFields);
        setModalState({ ...modalState, show: false });
    }

    const getOneData = useCallback(async (data?: Record<string, AllType>) => {
        if (props.form && data) {
            const dataDB = await props.form.getData(data);
            if (dataDB) {
                if (!props.globalMetadata) {
                    props.form.setFields(prev => {
                        return {
                            data: {
                                ...prev.data,
                                ...dataDB
                            },
                            errors: {}
                        }
                    });
                } else {
                    setOtorFields({
                        flow_id: dataDB.id as number,
                        flow_state: dataDB.next_state as string,
                        flow_action: dataDB.action_id as string,
                        flow_menu: dataDB.menu_id as string
                    })
                    props.form.setFields(prev => {
                        return {
                            data: {
                                ...prev.data,
                                ...dataDB.data as Record<string, AllType>
                            },
                            errors: {}
                        }
                    });
                }
            } else {
                alert.swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Data tidak ditemukan'
                })
                setModalState({ ...modalState, show: false });
            }
        }
    }, [props.form, alert.swal, modalState, props.globalMetadata]);

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

    useEffect(()=> {
        if (props.form) {
            if (props.globalMetadata) {
                setMetadata(props.globalMetadata[otorFields.flow_menu]);
            } else {
                setMetadata(props.form);
            }
        }
    }, [props.form, props.globalMetadata, otorFields.flow_menu]);
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
                        props.form?.setFields(defaultFields);
                        setModalState({ ...modalState, show: e })
                    }}    
                    title={modalState.title}
                    form={{
                        menu_id: props.globalMetadata ? otorFields.flow_menu : props.menu_id,
                        mode: props.globalMetadata ? otorFields.flow_action : modalState.mode,
                        state: props.globalMetadata ? otorFields.flow_state : modalState.state,
                        ...props.form,
                        ...metadata
                    }}
                    submitForm={submitForm}
                />
            )}
         </div>
    )
}

export default Layout;