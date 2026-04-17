import { useNavigate } from "react-router-dom";
import supabase from "../../config/supabaseClient";

const Home = () => {
    const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        const {error} = await supabase.auth.signOut();

        if(error){
            throw new Error(error.message)
        } 

        navigate('/');
    } catch (error) {
        console.error((error as Error).message)
    }
  }
  
  return (
    <main>
      <p>This is homepage...</p>
      <button onClick={() => handleLogout()} className="font-bold px-10 py-5 bg-black text-white rounded cursor-pointer">Logout</button>
    </main>
  )
}

export default Home
