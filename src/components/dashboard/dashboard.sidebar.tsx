'use client';
import Link from "next/link";
import MenuRC, { SubMenu, MenuItem } from 'rc-menu';
import { SidebarProps } from "./types";

const MenuBar = (props: SidebarProps) => {
    return (
        <>
            {props.menu.map((item, index) => {
                const menukey = item.menu_id ?? `submenu-${index}`;
                if (item.childs) {
                    return (
                        <SubMenu
                            key={menukey}
                            title={
                                <div className="my-2 bg-slate-50 py-2 rounded-md hover:bg-slate-100 cursor-pointer active:bg-slate-200" style={{ paddingLeft: 16 }}>
                                    {item.menu_name}
                                </div>
                            }
                        >
                            <MenuBar menu={item.childs} prefix={props.prefix} level={(props.level ?? 0) + 1} />
                        </SubMenu>
                    )
                }
                return (
                    <Link
                        key={menukey}
                        href={`${props.prefix}/${item.url}`}
                        id={menukey}
                    >
                        <MenuItem
                            className="my-2 bg-slate-50 py-2 rounded-md hover:bg-slate-100 cursor-pointer active:bg-slate-200"
                            style={{ paddingLeft: 16 + (props.level ?? 0) * 16 }}
                            id={menukey}
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
            className="p-4 mt-16 overflow-auto max-h-[85%]"
            id="sidebar"
        >
            <MenuBar menu={props.menu} prefix={props.prefix} />
        </MenuRC>
    )
}

export default Sidebar;