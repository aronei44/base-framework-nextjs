'use client';
import { createContext, useCallback, useContext, useState, useEffect } from "react";
import { login, logout, checkSession } from "@/extras/security";
import { usePathname, useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { User } from "@/data/types";
import { AuthContextType, LoginData } from "./types";
import { useAlert } from "./alertcontext";

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
  const alert = useAlert();

  const [user, setUser] = useState<null | User>(null);
  const [form, setForm] = useState<LoginData>({
    email: '',
    password: ''
  });

  const Login = useCallback(async (props: LoginData) => {
      const { data } = await login(props.email, props.password);
      if (data.success) {
        if (typeof window !== 'undefined') {
          alert.toast.success('Login success', 'Success', {
            timeOut: 1000,
            positionClass: 'toast-top-right',
            onHidden() {
              window.location.reload();
            },
          });
        }
        setForm({
          email: '',
          password: ''
        });
      } else {
        alert.toast.error(data.message, 'Error', {
          timeOut: 1000,
          positionClass: 'toast-top-right'
        });
      }
    }, [alert]);

  const Logout = useCallback(async () => {
    const { data } = await logout();
    if (data.success) {
      if (typeof window !== 'undefined') {
        alert.toast.success('Logout success', 'Success', {
          timeOut: 500,
          positionClass: 'toast-top-right',
          onHidden() {
            window.location.reload();
          },
        });
      }
    } else {
      alert.toast.error(data.message, 'Error', {
        timeOut: 1000,
        positionClass: 'toast-top-right'
      });
    }
  }, [alert]);

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
  }, [form, user, Login, Logout]);

  return (
    <AuthContext.Provider value={value()}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;