import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../state/store"
import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import { setStoreName, setUser } from "../state/auth/authSlice"
import { ClipLoader } from "react-spinners"

const MainLayout = () => {
  const userId = useSelector((state: RootState) => state.auth.user.id);
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();
  const [loading, setLoading] = useState<Boolean>(false)

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);

        const {data, error} = await supabase.auth.getSession();
        
        if(error) throw error;

        const {data: storeDeets, error: storeDeetsErr} = await supabase.from("profiles").select("*").eq("id", data.session?.user.id);

        if(storeDeetsErr) throw error;

        dispatch(setUser(data.session?.user.id));
        dispatch(setStoreName(storeDeets[0].store_name));
      } catch (error) {
        console.error((error as Error).message);
      }finally{
        setLoading(false);
      }
    }

    getUser();
  }, [navigate])

  if(loading) return null;

  return (
    <>
      {loading ? (
        <main className="h-screen w-full bg-green-500 flex justify-center items-center">
          <ClipLoader/>
        </main>
      ):(
        <div className="min-h-[100dvh] flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
      )}
    </>
  )
}

export default MainLayout
