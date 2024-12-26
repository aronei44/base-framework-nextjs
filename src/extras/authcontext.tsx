'use client';
import { createContext, useCallback, useContext, useState, useEffect } from "react";
import { login, logout, checkSession } from "@/extras/security";
import { useParams, usePathname, useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { User, Application, Menu } from "@/data/types";
import { AuthContextType, LoginData } from "./types";
import { useAlert } from "./alertcontext";
import { getApplication, getMenu } from "@/data/access";

export const AuthContext = createContext<AuthContextType>({
  state: {
    form: {
      email: '',
      password: ''
    },
    user: null,
    application: [],
    activeApp: '',
    menu: [],
    param: {}
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
  const param = useParams();

  const [user, setUser] = useState<null | User>(null);
  const [form, setForm] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [application, setApplication] = useState<Application[]>([]);
  const [menu, setMenu] = useState<Menu[]>([]);
  const [activeApp, setActiveApp] = useState<string>('');
  const [loading, setLoading] = useState<{
    application: boolean;
    menu: boolean;
  }>({
    application: false,
    menu: false
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

  const getApplications = async (role_id: string) => {
    setLoading(prev => ({
      ...prev,
      application: true
    }));
    const apps = await getApplication(role_id);
    setApplication(apps);
    setLoading(prev => ({
      ...prev,
      application: false
    }));
  }

  const getMenuList = async (role_id: string, app_id: string) => {
    setLoading(prev => ({
      ...prev,
      menu: true
    }));
    const menus = await getMenu(role_id, app_id);
    setMenu(menus);
    setLoading(prev => ({
      ...prev,
      menu: false
    }));
  }

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

  useEffect(() => {
    if (user?.role) {
      getApplications(user.role.role_id);
    } else {
      setApplication([]);
    }
  }, [user]);

  useEffect(() => {
    if (param.application && !loading.application && application.length > 0) {
      const app = application.find((app) => app.prefix === param.application);
      if (app) {
        setActiveApp(app.app_name);
        setMenu([]);
      } else {
        alert.swal.fire({
          title: '403 Forbidden',
          text: 'Application not available for your role',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        router.push('/');
      }
    } else {
      setActiveApp('');
    }
  }, [param, application, router, alert, loading.application]);

  useEffect(() => {
    if (user?.role && !loading.menu && param.application && menu.length === 0) {
      getMenuList(user.role.role_id, param.application as string);
    }
  }, [user, param, loading.menu, menu]);


  const value = useCallback(()=> {
    return {
      state: {
        form,
        user,
        application,
        activeApp,
        menu,
        param
      },
      action: {
        Login,
        Logout,
        setForm
      }
    }
  }, [form, user, Login, Logout, application, activeApp, menu, param]);

  return (
    <AuthContext.Provider value={value()}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;