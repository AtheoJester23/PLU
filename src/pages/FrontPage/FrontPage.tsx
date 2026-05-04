import { Eye, EyeClosed } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import supabase from "../../config/supabaseClient"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../state/store"
import { setStoreName, setUser } from "../../state/auth/authSlice"
import { ClipLoader } from "react-spinners"

type possibleErrs = {
  email: boolean,
  password: boolean
}

const FrontPage = () => {
  const [hidden, setHidden] = useState(true)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<possibleErrs>({
    email: false,
    password: false
  })
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const theme = useSelector((state: RootState) => state.ui.theme)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log(email, password);

    const errs = {...errors};

    if(!email || email.replace(/[ ]g/, '') == "" ){
      errs.email = true;
    }

    if(!password || password.replace(/[ ]g/, '') == ''){
      errs.password = true;
    }

    if(Object.values(errs).includes(true)){
      setErrors(errs);
      return;
    }

    try {
      setLoading(true)
      const {data, error} = await supabase.auth.signInWithPassword({email, password});
      
      if(error){
        throw new Error(error.message);
      }

      const {data: storeDeets, error: storeDeetsErr} = await supabase.from("profiles").select("*").eq("id", data.user.id);

      if(storeDeetsErr) throw storeDeetsErr;

      console.log(data);

      console.log('Logged in successfully...', data.user.id)

      dispatch(setUser(data.user.id));
      dispatch(setStoreName(storeDeets[0].store_name))
      navigate('/home')
    } catch (error) {
      console.error((error as Error).message);
    }finally{
      setLoading(false)
    }

  }

  useEffect(() => {
    const checkSesh = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error(error.message);
          return;
        }

        if (session) {
          navigate('/home');
        }
      } catch (error) {
        console.error((error as Error).message);
      } finally{
        setLoading(false);
      }
    };

    checkSesh();
  }, [])

  if(loading){
    return (
      <div className="h-[100%] flex justify-center items-center font-bold bg-main">
        <ClipLoader className="text-red-500" color={`${theme == "light" ? "black" : "white"}`}/>
      </div>
    )
  }

  return (
    <main className="bg-main h-[100dvh] border flex justify-center items-center">
      <form onSubmit={(e) => handleLogin(e)} className="flex flex-col bg-sub shadow p-5 rounded gap-3">
        <h1 className="text-4xl font-bold">Sign-in</h1>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <input onChange={() => setErrors(prev => ({...prev, email: false}))} type="email" name="email" id="username" className="bg-white rounded px-4 py-2" placeholder="Username"/>
            {errors.email && <small className="text-red-500">Invalid email address</small>}
          </div>
          
          <div className="relative">
            <button onClick={() => setHidden(prev => !prev)} type="button" className="hover:cursor-pointer active:cursor-default">
              {!hidden 
                ? <Eye className="absolute top-2 right-2"/>
                : <EyeClosed className="absolute top-2 right-2"/>
              }
            </button>
            <input onChange={() => setErrors(prev => ({...prev, password: false}))} type={hidden ? "password" : "text"} name="password" id="password" className="bg-white rounded ps-4 pe-10 py-2 w-full" placeholder="Password" autoComplete="off"/>
            {errors.password && <small className="text-red-500">Incorrect password</small>}
          </div>

        </div>
        <div className="flex gap-2">
          <p className="text-gray-500">Don't have an account yet? </p>
          <Link to={'/signUp'} className="font-bold text-blue-500 underline">Sign-up now!</Link>
        </div>
        {loading 
          ? <div className="bg-[#DDB892] text-white font-bold p-3 rounded -translate-y-0.5 duration-200 hover:cursor-pointer hover:translate-none flex justify-center items-center">Loading</div>
          : <button className="bg-[#B08968] text-white font-bold p-3 rounded -translate-y-0.5 duration-200 hover:cursor-pointer hover:translate-none">Login</button>       
        }
      </form>
    </main>
  )
}

export default FrontPage
