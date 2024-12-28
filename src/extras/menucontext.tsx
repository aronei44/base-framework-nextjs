'use client';
import { createContext, useCallback, useContext, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Menu } from "@/data/types";
import { MenuContextType } from "./types";
import { getMenu } from "@/data/access";
import { useAuth } from "./authcontext";

export const MenuContext = createContext<MenuContextType>({
  state: {
    menu: []
  }
});

export const useMenu = () => {
  return useContext(MenuContext);
};

export const MenuProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const auth = useAuth();
  const {state: {user}} = auth;
  const param = useParams();

  const [menu, setMenu] = useState<Menu[]>([]);
  const [loading, setLoading] = useState<{
    application: boolean;
    menu: boolean;
  }>({
    application: false,
    menu: false
  });

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
  };

  useEffect(() => {
    if (user?.role && !loading.menu && param.application && menu.length === 0) {
      getMenuList(user.role.role_id, param.application as string);
    }
  }, [user, param, loading.menu, menu]);


  const value = useCallback(()=> {
    return {
      state: {
        menu
      }
    }
  }, [menu]);

  return (
    <MenuContext.Provider value={value()}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuProvider;