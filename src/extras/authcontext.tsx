'use client';
import { createContext, useCallback, useContext, useState, useEffect } from "react";
import { login, logout, checkSession } from "@/extras/security";
import { usePathname, useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { User } from "@/data/types";
import { AuthContextType, LoginData } from "./types";

export const AuthContext = createContext<AuthContextType>({
  state: {
    form: {
      email: '',
      password: ''
    },
    user: null
  },
  action: {
    Login: async (props: LoginData) => {
      console.log(props)
    },
    Logout: async () => {},
    setForm: (e: LoginData) => {
      console.log(e)
    }
  }
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<null | User>(null);
  const [form, setForm] = useState<LoginData>({
    email: '',
    password: ''
  });

  const Login = async (props: LoginData) => {
    const { data } = await login(props.email, props.password);
    if (data.success) {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } else {
      alert(data.message);
    }
    setForm({
      email: '',
      password: ''
    });
  }

  const Logout = async () => {
    const { data } = await logout();
    if (data.success) {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } else {
      alert(data.message);
    }
  };

  const CheckAccess = async (pathname: string, router: AppRouterInstance) => {
    const { data } = await checkSession();
    if (data.success) {
      setUser(data.data as User);
      if (pathname === '/login') {
        router.push('/');
      }
    } else if (pathname !== '/login') {
      setUser(null);
      router.push('/login');
    }
  }

  useEffect(() => {
    if (pathname && router) {
      CheckAccess(pathname, router);
    }
  }, [pathname, router]);

  const value = useCallback(()=> {
    return {
      state: {
        form,
        user
      },
      action: {
        Login,
        Logout,
        setForm
      }
    }
  }, [form, user]);

  return (
    <AuthContext.Provider value={value()}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;