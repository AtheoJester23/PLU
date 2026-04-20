import { Circle, LogOut, Moon, Plus, Store, Sun } from "lucide-react"
import { Link, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../state/store";
import { setTheme } from "../state/UI/uiSlice";
import { useEffect } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
    const id = useSelector((state: RootState) => state.auth.user.id)
    const theme = useSelector((state: RootState) => state.ui.theme);
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();

    useEffect(() => {
        console.log(theme === "light");
    }, [])

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
    
    useEffect(() => {
        const root = document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [theme]);

    return (
        <motion.nav
            initial={{y: -100}}
            animate={{y: 0}}
            transition={{type: "spring", stiffness: 200, damping: 30}}
            className="z-2000 bg-nav w-full fixed top-0 px-[20px] py-[10px] flex justify-between items-center gap-3"
        >
            <Link to={"/"} className="flex items-center gap-2">
                <Store className="text-white" aria-hidden="true" />
                <span className="text-xl font-bold text-white">Testing</span>
            </Link>

            <div className="flex gap-2 justify-center items-center">
                <button onClick={() => console.log(id)}>testing</button>
                
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
                <Link to={"/create"} className="flex gap-2 px-[10px] py-[10px] rounded text-white bg-navBtn shadow hover:translate-y-0.25 duration-200 cursor-pointer active:cursor-default">
                    <Plus aria-hidden="true"/>
                </Link>
                <button onClick={() => handleLogout()} className="flex justify-center items-center text-[var(--textColorr)] border-2 border-navBtn px-5 py-2 rounded hover:bg-navBtn cursor-pointer hover:border-navBtn duration-200 hover:translate-y-0.25">
                    <LogOut aria-hidden="true"/>
                    <span>Logout</span>
                </button>
            </div>
        </motion.nav>
    )
}

export default Navbar
