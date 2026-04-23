import { LogOut, Moon, Plus, Sun } from 'lucide-react'
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../state/store'
import { setTheme } from '../../state/UI/uiSlice'
import { Link, useNavigate } from 'react-router-dom'
import { setStoreName, setUser } from '../../state/auth/authSlice';
import supabase from '../../config/supabaseClient';

const Menu = () => {
    const theme = useSelector((state: RootState) => state.ui.theme);
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();
     
    const changeTheme = () => {
        dispatch(setTheme(theme == "light" ? "dark" : "light"))
    };

    const handleLogout = async () => {
        try {
            const {error} = await supabase.auth.signOut();

            if(error){
                throw new Error(error.message)
            } 

            dispatch(setUser(null));
            dispatch(setStoreName(null))

            navigate('/');
        } catch (error) {
            console.error((error as Error).message)
        }
    }

    const handleTheme = () => {
        const nextTheme = theme === "light" ? "dark" : "light";

        dispatch(setTheme(nextTheme));
        console.log(theme);

        const root = document.documentElement;

        if(theme === "dark"){
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }

  return (
    <main className='pt-[65px] p-7 bg-main h-[100dvh]'>
      <h1 className={`text-center text-2xl font-bold text-${theme == "light" ? "nav" : "sub"}`}>Menu</h1>
      <ul className='mt-5 p-2 flex flex-col gap-3'>
        <li className='flex rounded-lg'>
            <button onClick={() => changeTheme()} role='switch' className='border w-full border-nav border-2 border-dashed rounded flex justify-between p-3'>
                <div className={`flex gap-2 text-${theme == "light" ? "nav" : "white"}`}>
                    <Moon aria-hidden="true"/>
                    <span className='font-bold'>Dark Mode</span>
                </div>

                <button
                    onClick={handleTheme}
                    className={`relative w-[70px] h-[30px] bg-[#7E6363] rounded-full px-1 cursor-pointer flex items-center`}
                    >
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{
                            opacity: 1,
                            x: theme === "dark" ? 0 : 40,
                        }}
                        transition={{type: "spring", stiffness: 200, damping: 30}}
                        className="absolute left-1" 
                    >
                        {theme === "dark" && <Moon aria-hidden="true"/>}
                    </motion.div>

                    <motion.div
                        animate={{
                            x: theme === "dark" ? 29 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 30 }}
                        className="z-200 w-[32px] h-[22px] bg-white rounded-full"
                    />

                    <motion.div
                        initial={{opacity: 0}}
                        animate={{
                            opacity: 1,
                            x: theme === "dark" ? 0 : 38,
                        }}
                        transition={{type: "spring", stiffness: 200, damping: 30}}
                        className="absolute left-1" 
                    >
                        {theme === "light" && <Sun/>}
                    </motion.div>
                </button>
            </button>
        </li>
        <li className='flex rounded-lg'>
            <Link to={"/create"} className='border w-full border-nav border-2 border-dashed rounded flex justify-between p-3'>
                <div className={`flex gap-2 text-${theme == "light" ? "nav" : "white"}`}>
                    <Plus aria-hidden="true"/>
                    <span className='font-bold'>Add product</span>
                </div>
            </Link>
        </li>
        <li className='flex rounded-lg'>
            <button onClick={() => handleLogout()} role='switch' className='border w-full border-nav border-2 border-dashed rounded flex justify-between p-3'>
                <div className={`flex gap-2 text-${theme == "light" ? "nav" : "white"}`}>
                    <LogOut aria-hidden="true"/>
                    <span className='font-bold'>Logout</span>
                </div>
            </button>
        </li>
      </ul>
    </main>
  )
}

export default Menu
