export type AllType = string | number | boolean | object | null | undefined | void;

export type SafeCall = {
    name?: string;
    tracer?: number;
    fn: () => Promise<AllType | void>;
}

export type SafeCallFunction = (data: SafeCall) => Promise<{ data: AllType; tracer: number; }>;