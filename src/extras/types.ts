import { Application, Menu, User } from "@/data/types";
import { Params } from "next/dist/server/request/params";
import Swal from "sweetalert2";

type AllPrimitiveType = string | number | boolean | null | undefined | void | object;
export type AllType = AllPrimitiveType | Record<string, AllPrimitiveType> | Array<AllPrimitiveType>;


// safecall.ts
export type SafeCall = {
    name?: string;
    tracer?: number;
    fn: (tracer?: number) => Promise<AllType | void>;
}

export type SafeCallFunction = (data: SafeCall) => Promise<{ data: AllType; tracer: number; error: boolean }>;


// xhr.ts
export type CallApi = {
    baseUrl?: string;
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    data?: Record<string, string>;
    params?: Record<string, string>;
    responseType?: "json" | "text" | "blob";
    timeout?: number;
    withCredentials?: boolean;
    tracer?: number;
    name?: string;
}

export type CallApiFunction = (data: CallApi) => Promise<{ data: AllType; tracer: number; error: boolean }>;


// redis.ts
export type RedisType = {
    host?: string,
    port?: number,
    password?: string,
    db?: number
}


// authcontext.tsx
export type LoginData = {
    email: string;
    password: string;
}
export type AuthContextType = {
    state: {
        form: LoginData;
        user: User | null;
        application: Application[];
        activeApp: string;
        param: Params;
    };
    action: {
        Login: (props: LoginData) => Promise<void>;
        Logout: () => Promise<void>;
        setForm: (data: LoginData) => void;
    };
}

export type MenuContextType = {
    state: {
        menu: Menu[];
    };
}

// alertcontext.tsx
export type AlertContextType = {
    swal: typeof Swal;
    toast: Toastr;
}
