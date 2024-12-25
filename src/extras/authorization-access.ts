import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { checkSession } from "./security";

const CheckAccess = async (pathname: string, router: AppRouterInstance) => {
    const {data} = await checkSession();
    if (data.success) {
        if (pathname === '/login') {
            router.push('/');
        }
    } else if (pathname !== '/login') {
        router.push('/login');
    }
}

export {
    CheckAccess
}