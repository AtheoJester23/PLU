import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../state/store"
import { useEffect } from "react"
import supabase from "../config/supabaseClient"
import { setUser } from "../state/auth/authSlice"

const MainLayout = () => {
  const userId = useSelector((state: RootState) => state.auth.user.id);
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const getUser = async () => {
      try {
        const {data, error} = await supabase.auth.getSession();
        
        if(error) throw error;

        dispatch(setUser(data.session?.user.id));
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
