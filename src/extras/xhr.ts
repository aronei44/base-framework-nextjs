'use server';

import axios from "axios";
import safecall from "./safecall";
import { AllType, CallApiFunction } from "./types";


const callApi: CallApiFunction = async ({
    baseUrl = "",
    url,
    method = "GET",
    headers = {},
    data = {},
    params = {},
    responseType = "json",
    timeout = 30000,
    withCredentials = false,
    tracer,
    name
}) => {
    const { data: response} = await safecall({
        name: name ?? "callApi",
        tracer,
        fn: async () => {
            const res = await axios({
                method,
                url: baseUrl + url,
                headers,
                data,
                params,
                responseType,
                timeout,
                withCredentials
            });
            return res.data as Record<string, AllType> | null;
        }
    });
    return { data: response, tracer: tracer ?? 0 };
};

export default callApi;