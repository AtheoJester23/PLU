import { useNavigate } from "react-router-dom";
import supabase from "../../config/supabaseClient";

const Home = () => {
    const navigate = useNavigate();
  
  return (
    <main className="h-[2000px] bg-main pt-25 px-10">
      <h1 className="text-3xl font-bold text-">Products</h1>
    </main>
  )
}

export default Home
