'use client';
import Link from "next/link";
import { DropdownProps } from "./types";


const Dropdown = (props: DropdownProps) => {
    return (
        <div className="relative">
            <h4
                className="text-lg cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    props.setShowDropdown(!props.showDropdown);
                }}
            >
                {props.user?.name} | {props.user?.role?.role_name}
            </h4>
            {props.showDropdown && (
                <div className="absolute top-10 right-0 bg-white py-4 px-8 rounded-lg min-w-64 border border-gray-300">
                    {props.application.map((app, index) => {
                        return (
                            <Link
                                key={'app_' + index}
                                id={app.app_id}
                                href={`/app/${app.prefix}`}
                            >
                                <p className={"my-2 cursor-pointer py-2 px-4 hover:bg-slate-50 rounded-md " + (app.app_name === props.activeApp ? 'bg-slate-200' : '')}>
                                    {app.app_name}
                                </p>
                            </Link>
                        );
                    })}
                    <hr />
                    <p
                        className="my-2 cursor-pointer text-red-500 py-2 px-4 hover:bg-red-500 hover:text-white rounded-md"
                        onClick={() => props.Logout()}
                    >
                        Logout
                    </p>
                </div>
            )}
        </div>
    )
}

export default Dropdown;