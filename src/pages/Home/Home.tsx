import { Link } from "react-router-dom";
import supabase from "../../config/supabaseClient";
import { ChevronDown, Plus } from "lucide-react";
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
    const [sort, setSort] = useState("lowToHigh")
    const theme = useSelector((state: RootState) => state.ui.theme);
    const userId = useSelector((state: RootState) => state.auth.user.id);
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
          const {data, error} = await supabase.from('products').select().eq('store_id', userId).order('price', { ascending: true });

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

    const handleSort = () => {
      setSort(prev => prev === "lowToHigh" ? "highToLow" : "lowToHigh");
      console.log(sort);

      if(sort === "lowToHigh"){
        const ascending = products.sort((a, b) => a.price - b.price);
        console.log(ascending);
      }else{
        const descending = products.sort((a, b) => b.price - a.price);
        console.log(descending);
      }
    }

  return (
    <main className={`auto-rows-fr max-sm:py-[65px] py-[90px] px-7 ${products && products?.length < 6 && "h-[100vh]"} bg-main`}>
      <h1 className="text-3xl font-bold p-0 text-nav text-center">Products</h1>
      
      <div className="flex justify-end">
        <div className="flex gap-3 justify-center items-center">
          <small>sort by: </small>
          <div className="relative">
            <select onChange={() => handleSort()} defaultValue={"lowToHigh"} name="" id="" className="focus:outline-none focus:ring-0 bg-white py-2 pe-10 ps-4 rounded appearance-none">
              <option value="lowToHigh">Price low to high</option>
              <option value="hightoLow">Price high to low</option>
            </select>
            <ChevronDown className="absolute top-2 right-2"/>
          </div>
        </div>
      </div>
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
            <ul className="grid max-sm:grid-cols-2 grid-cols-5 gap-5 mt-5 pb-5 w-full">
                {products.map(item => (
                    <li key={item.id} className="bg-white flex flex-col items-center p-5 shadow-lg rounded gap-3 hover:translate-y-2 hover:shadow-none duration-350 cursor-pointer active:cursor-default">
                        <Link to={`/edit/${item.id}`}>
                          <div className="max-sm:h-[110px] h-[230px] w-full overflow-hidden flex justify-center items-center">
                              <img src={item.picture} alt={item.name} />
                          </div>
                          <div>
                              <h2>{item.name}</h2>
                              <p>₱{item.price.toFixed(2)}</p>
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
