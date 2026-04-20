import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../state/store"
import { useEffect } from "react"
import supabase from "../config/supabaseClient"
import { setStoreName, setUser } from "../state/auth/authSlice"

const MainLayout = () => {
  const userId = useSelector((state: RootState) => state.auth.user.id);
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const getUser = async () => {
      try {
        const {data, error} = await supabase.auth.getSession();
        
        if(error) throw error;

        const {data: storeDeets, error: storeDeetsErr} = await supabase.from("profiles").select("*").eq("id", data.session?.user.id);

        if(storeDeetsErr) throw error;

        dispatch(setUser(data.session?.user.id));
        dispatch(setStoreName(storeDeets[0].store_name));
      } catch (error) {
        console.error((error as Error).message);
      }
    }

    if(!userId){
      getUser();
    }
  }, [])

  return (
    <div className="min-h-[100dvh] flex flex-col">
        <Navbar />
        <main className="flex-1">
            <Outlet />
        </main>
    </div>
  )
}

export default MainLayout
