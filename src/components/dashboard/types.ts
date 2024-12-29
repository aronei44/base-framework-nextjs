import { Menu, Application, User } from "@/data/types";

export type SidebarProps = {
    menu: Menu[];
    prefix: string;
    level?: number;
}

export type DropdownProps = {
    user: User;
    application: Application[];
    activeApp: string;
    Logout: () => void;
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
}