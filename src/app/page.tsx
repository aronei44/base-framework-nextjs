'use client';

import { Button } from "@/components";
import { useAuth } from "@/extras/authcontext";
import Link from "next/link";

export default function Home() {
  const auth = useAuth();
  const { state } = auth;
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-slate-100 pt-20">
      <div className="w-2/3 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center">Selamat Datang</h1>
        <h4 className="text-center text-gray-500">{state.user?.name} | {state.user?.role?.role_name}</h4>
      </div>
      <div className="w-2/3 flex mt-24 justify-center flex-wrap">
        {state.application.map((app, index) => {
          return (
            <Link 
              href={'/app/' + app.prefix} 
              key={'app_' + index} 
              id={app.app_id}
              className="bg-white p-8 rounded-lg shadow-lg w-1/4 h-40 m-8 text-center hover:shadow-xl hover:bg-slate-50"
            >
              <h1 className="text-2xl font-bold">{app.app_name}</h1>
              <hr />
              <h4 className="text-gray-500 mt-8">{app.description}</h4>
            </Link>
          )
        })}
      </div>
      <div className="fixed bottom-0 right-0 p-8">
        <Button
          onClick={auth.action.Logout}
          label="Logout"
          color="red"
        />
      </div>
    </div>
  )
}
