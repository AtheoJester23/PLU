import { Link } from "react-router-dom";
import supabase from "../../config/supabaseClient";
import { ChevronDown, Funnel, Plus, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../state/store";
import { ClipLoader } from "react-spinners";
import { Dialog, DialogPanel } from "@headlessui/react";
import { motion } from "framer-motion";
import { setProductsState } from "../../state/UI/uiSlice";

export type productDetails = {
  created_at: string,
  category: string,
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
    
    const prods = useSelector((state: RootState) => state.ui.products);
    const dispatch = useDispatch<AppDispatch>();

    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
      const getProducts = async () => {
        try {
          setLoading(true)
          const {data, error} = await supabase.from('products').select().eq('store_id', userId).order('price', { ascending: true });

          if(error) throw error;

          setProducts(data);
          const withCategories = data.filter(item => item.category).map(item => item.category);
          setCategories([...new Set(withCategories)]);
          dispatch(setProductsState(data));
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
      if(sort === "lowToHigh"){
        const descending = [...products].sort((a, b) => b.price - a.price);
        setProducts(descending);
        setSort("highToLow");
        console.log(descending);
      }else{
        const ascending = [...products].sort((a, b) => a.price - b.price);
        setProducts(ascending);
        setSort("lowToHigh");
        console.log(ascending);
      }
    }

    const handleFilterProducts = (category: string) => {
      setOpen(false);
      console.log(prods);

      if(category === "All"){
        setProducts(prods);
        return;
      }else{
        setProducts(prods.filter(item => item.category === category));
      }
    }

  return (
    <main className={`auto-rows-fr max-sm:py-[65px] py-[140px] px-7 ${products && products?.length < 6 && "h-[100vh]"} bg-main`}>
      <h1 className="text-3xl font-bold p-0 text-nav text-center">Products</h1>
      
      <div className="flex justify-between fixed py-2 top-16 left-0 right-0 bg-navBtn z-100 px-5">
        <input type="text" placeholder="Search products..." className="bg-white px-5 rounded outline-none"/>
        <div className="flex gap-3 justify-center items-center">
          <small>sort by: </small>
          <div className="relative">
            <select onChange={() => handleSort()} defaultValue={"lowToHigh"} name="" id="" className="focus:outline-none focus:ring-0 bg-white py-2 pe-10 ps-4 rounded appearance-none">
              <option value="lowToHigh">Price low to high</option>
              <option value="hightoLow">Price high to low</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-2 right-2"/>
          </div>
          <button onClick={() => setOpen(true)} className="bg-nav p-2 rounded cursor-pointer hover:bg-[#7E6363]">
            <Funnel color="white"/>
          </button>
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
      <Dialog open={open} onClose={() => setOpen(false)} className={`relative z-500`}>
        <motion.div className="fixed inset-0 bg-black/60" 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        />
        
        <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>

            <DialogPanel className="mx-auto max-w-sm rounded bg-white p-5 max-sm:w-[90%] sm:w-[50%] h-[50%] overflow-y-auto">
                <>
                    {products.length > 0 ? (
                      <ul className='flex justify-center flex-col items-center gap-3'>
                        {categories.map((item, index) => (
                          <li onClick={() => handleFilterProducts(item)} key={index} className="bg-navBtn text-white w-full p-5 rounded flex font-bold cursor-pointer -translate-y-0.25 hover:translate-none duration-200">
                            <span>{item}</span>
                          </li>
                        ))}
                        <li onClick={() => handleFilterProducts("All")} key="all" className="bg-navBtn text-white w-full p-5 rounded flex font-bold cursor-pointer -translate-y-0.25 hover:translate-none duration-200">
                          <span>All</span>
                        </li>
                      </ul>
                    ):(
                      <div className="flex flex-col justify-center items-center gap-2">
                        <TriangleAlert className="text-red-500" size={50}/>
                        <p className="font-bold text-red-500">No products to filter</p>
                      </div>
                    )}
                    
                </>
            </DialogPanel>
        </div>
      </Dialog>
    </main>
  )
}

export default Home
