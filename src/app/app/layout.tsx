'use client';
import { User } from "@/data/types";
import { useAuth } from "@/extras/authcontext";
import { useState } from "react";
import {LayoutDropdown, LayoutSidebar} from "@/components";

const LayoutDashboard = ({ children }: {
    children: React.ReactNode;
}) => {
    const auth = useAuth();
    const { state, action } = auth;
    const [showDropdown, setShowDropdown] = useState(false);
    return (
        <div className="grid grid-cols-5" onClick={() => setShowDropdown(false)}>
            <div className="col-span-1 bg-white h-screen border-r border-gray-200">
                <div className="bg-white shadow-md p-4 absolute top-0 w-full flex justify-between items-center h-16">
                </div>
                <LayoutSidebar menu={state.menu || []} prefix={`/app/${state.param.application}`} />
            </div>
            <div id="content" className="col-span-4 bg-gray-200 min-h-screen overflow-auto relative">
                <div className="bg-white shadow-md p-4 absolute top-0 w-full flex justify-between items-center h-16">
                    <h1 className="text-2xl font-semibold">{state.activeApp}</h1>
                    <LayoutDropdown
                        user={state.user as User}
                        application={state.application}
                        activeApp={state.activeApp}
                        Logout={action.Logout}
                        showDropdown={showDropdown}
                        setShowDropdown={setShowDropdown}
                    />
                </div>
                <div className="mt-16 p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default LayoutDashboard;