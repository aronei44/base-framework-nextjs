import { FormBuilderProps, MetadataBuilderProps } from "../form/types";
import { MenuAction, DBPagination, DBFilter } from "@/data/types";
import { AllType } from "@/extras/types";
import { TableColumn } from "react-data-table-component";

export type FormModalProps = {
    children?: React.ReactNode;
    setOpen: (isOpen: boolean) => void;
    title: string;
    form?: FormBuilderProps
}

export type HeaderProps = {
    title: string;
    rightComponent?: React.ReactNode;
}

export type ModalProps = {
    children: React.ReactNode;
    isOpen: boolean;
}

export type ActionCellProps = {
    row: Record<string, unknown>;
    index: number;
    tableActionMenu: MenuAction[];
    setModalState: (state: { show: boolean; title: string; mode: string; state: string }) => void;
    getOneData: (data: Record<string, AllType>) => void;
    setShowAction: (index: number | null) => void;
    showAction: number | null;
}

export type LayoutProps = {
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