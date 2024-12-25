'use client';
import Swal from "sweetalert2";
import * as toastr from "toastr";
import { createContext, useCallback, useContext } from "react";
import { AlertContextType } from "./types";

export const AlertContext = createContext<AlertContextType>({
  swal: Swal,
  toast: toastr
});

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }: {
  children: React.ReactNode;
}) => {

  const value = useCallback(() => {
    return {
      swal: Swal,
      toast: toastr
    }
  }, []);

  return (
    <AlertContext.Provider value={value()}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;