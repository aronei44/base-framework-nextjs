type AllPrimitiveType = string | number | boolean | null | undefined | void | object;
export type AllType = AllPrimitiveType | Record<string, AllPrimitiveType> | Array<AllPrimitiveType>;


// safecall.ts
export type SafeCall = {
    name?: string;
    tracer?: number;
    fn: () => Promise<AllType | void>;
}

export type SafeCallFunction = (data: SafeCall) => Promise<{ data: AllType; tracer: number; }>;


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

export type CallApiFunction = (data: CallApi) => Promise<{ data: AllType; tracer: number; }>;