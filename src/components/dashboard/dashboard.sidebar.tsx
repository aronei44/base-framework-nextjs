'use client';
import Link from "next/link";
import MenuRC, { SubMenu, MenuItem } from 'rc-menu';
import { SidebarProps } from "./types";

const MenuBar = (props: SidebarProps) => {
    return (
        <>
            {props.menu.map((item) => {
                if (item.childs) {
                    return (
                        <SubMenu key={item.menu_id} title={item.menu_name}>
                            <MenuBar menu={item.childs} prefix={props.prefix} />
                        </SubMenu>
                    )
                }
                return (
                    <Link
                        key={item.menu_id}
                        href={`${props.prefix}/${item.url}`}
                        id={item.menu_id}
                    >
                        <MenuItem
                            className="my-2 bg-slate-50 py-2 rounded-md hover:bg-slate-100 cursor-pointer active:bg-slate-200"
                            style={{ paddingLeft: 16 }}
                        >
                            {item.menu_name}
                        </MenuItem>
                    </Link>
                )
            })}
        </>
    )
}

const Sidebar = (props: SidebarProps) => {
    return (
        <MenuRC
            mode="inline"
            className="p-4 mt-16 overflow-auto"
            id="sidebar"
        >
            <MenuBar menu={props.menu} prefix={props.prefix} />
        </MenuRC>
    )
}

export default Sidebar;