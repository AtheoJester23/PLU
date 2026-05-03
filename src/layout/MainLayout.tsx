import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../state/store"
import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import { setStoreName, setUser } from "../state/auth/authSlice"
import { ClipLoader } from "react-spinners"

const MainLayout = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();
  const [loading, setLoading] = useState<Boolean>(true)
  const theme = useSelector((state: RootState) => state.ui.theme);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {data: {session}, error} = await supabase.auth.getSession();
        
        if(error) throw error;

        if(!session){
          navigate("/");
        }

        const {data: storeDeets, error: storeDeetsErr} = await supabase.from("profiles").select("*").eq("id", session?.user.id);

        if(storeDeetsErr) throw error;

        dispatch(setUser(session?.user.id));
        dispatch(setStoreName(storeDeets[0].store_name));
      } catch (error) {
        console.error((error as Error).message);
      }finally{
        setLoading(false);
      }
    }

    getUser();
  }, [navigate])

  if(loading){
    return(
      <div className="h-[100%] flex justify-center items-center font-bold bg-main">
        <ClipLoader className="text-red-500" color={`${theme == "light" ? "black" : "white"}`}/>
      </div>
    )
  };

  return (
    <>
      {loading ? (
        <main className="h-screen w-full bg-green-500 flex justify-center items-center">
          <ClipLoader/>
        </main>
      ):(
        <div className="min-h-[100dvh] flex flex-col">
            <Navbar />
            <>
              <Outlet/>
            </>
        </div>
      )}
    </>
  )
}

export default MainLayout
