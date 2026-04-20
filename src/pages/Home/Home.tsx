import { Link, useNavigate } from "react-router-dom";
import supabase from "../../config/supabaseClient";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import { ClipLoader } from "react-spinners";

type productDetails = {
  created_at: string,
  description: string,
  id: string,
  name: string,
  picture: string,
  price: number,
  store_id: string,
  updated_at?: string
}[]

const Home = () => {
    const theme = useSelector((state: RootState) => state.ui.theme);
    const userId = useSelector((state: RootState) => state.auth.user.id);
    const navigate = useNavigate();
    const [products, setProducts] = useState<productDetails | []>([]);
    const [loading, setLoading] = useState<boolean>(true);
    let temporaryProducts = [
        {img: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60", name: "Product 1", price: 19.99, id: 1},
        {img: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60", name: "Product 2", price: 29.99, id: 2},
        {img: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60", name: "Product 3", price: 39.99, id: 3},
        {img: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60", name: "Product 4", price: 49.99, id: 4},
        {img: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60", name: "Product 5", price: 59.99, id: 5},
        {img: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60", name: "Product 1", price: 19.99, id: 6},
        {img: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60", name: "Product 2", price: 29.99, id: 7},
        {img: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60", name: "Product 3", price: 39.99, id: 8},
        {img: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60", name: "Product 4", price: 49.99, id: 9},
        {img: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60", name: "Product 5", price: 59.99, id: 10},
    ]

    temporaryProducts.length = 0;

    useEffect(() => {
      const getProducts = async () => {
        try {
          setLoading(true)
          const {data, error} = await supabase.from('products').select().eq('store_id', userId)

          if(error) throw error;

          setProducts(data);
        } catch (error) {
          console.error((error as Error).message)
        }finally{
          setLoading(false)
        }
      }
      
      if(!userId) return;
      getProducts();
    }, [userId])

  return (
    <main className={`auto-rows-fr py-[90px] px-10 ${products && products?.length < 6 && "h-[100vh]"} bg-main`}>
      <h1 className="text-3xl font-bold p-0">Products</h1>
      {loading ? (
        <div className="h-[100%] flex justify-center items-center font-bold">
          <ClipLoader className="text-red-500" color={`${theme == "light" ? "black" : "white"}`}/>
        </div>
      ):(
        <>
          {!products ? (
            <Link to={"/create"} className={`cursor-pointer flex flex-col mt-5 w-full h-[100%] flex justify-center items-center border-3 border-nav border-dashed rounded`}>
                <Plus aria-hidden="false" className="h-30 text-nav" size={100}/>
                <p className="font-bold text-4xl text-nav">No products yet...</p>
            </Link>
          ):(
            <ul className="grid grid-cols-5 gap-5 mt-5 px-5 pb-5 w-full">
                {products.map(item => (
                    <li key={item.id} className="bg-white flex flex-col items-center p-5 shadow-lg rounded gap-3 hover:translate-y-2 hover:shadow-none duration-350 cursor-pointer active:cursor-default">
                        <Link to={`/edit/${item.id}`}>
                          <div className="h-[230px] w-full overflow-hidden flex justify-center items-center">
                              <img src={item.picture} alt={item.name} />
                          </div>
                          <div>
                              <h2>{item.name}</h2>
                              <p>${item.price.toFixed(2)}</p>
                          </div>
                        </Link>
                    </li>
                ))}
            </ul>
          )}
        </>
      )}
    </main>
  )
}

export default Home
