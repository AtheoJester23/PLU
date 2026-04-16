import { Eye, EyeClosed } from "lucide-react"
import { useState, type FormEvent } from "react"

const FrontPage = () => {
  const [hidden, setHidden] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
  }

  return (
    <main className="bg-main h-[100vh] flex justify-center items-center">
      <form onSubmit={(e) => handleLogin(e)} className="flex flex-col bg-sub shadow p-5 rounded gap-3">
        <h1 className="text-4xl font-bold">Sign-in</h1>
        <div className="flex flex-col gap-2">
          <input type="text" name="username" id="username" className="bg-white rounded px-4 py-2" placeholder="Username"/>
          <div className="relative">
            <button onClick={() => setHidden(prev => !prev)} type="button" className="hover:cursor-pointer active:cursor-default">
              {!hidden 
                ? <Eye className="absolute top-2 right-2"/>
                : <EyeClosed className="absolute top-2 right-2"/>
              }
            </button>
            <input type={hidden ? "password" : "text"} name="password" id="password" className="bg-white rounded ps-4 pe-10 py-2" placeholder="Password" autoComplete="off"/>
          </div>
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
