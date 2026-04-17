import { Eye, EyeClosed } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { motion } from "framer-motion";
import supabase from "../../config/supabaseClient";
import { useNavigate } from "react-router-dom";

type possibleErrors = {
    firstName: boolean,
    lastName: boolean,
    store_name: boolean,
    email: boolean,
    password: boolean,
    confirmPassword: boolean,
}

const SignUp = () => {
    const [hidden, setHidden] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<possibleErrors>({
        firstName: false,
        lastName: false,
        store_name: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const navigate = useNavigate();

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        const first_name = formData.get("firstName") as string;
        const last_name = formData.get("lastName") as string;
        const store_name = formData.get('storeName') as string;
        const errs = {...errors};
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        console.log(first_name, last_name, store_name);
        
        if(!first_name || first_name.replace(/[ ]/g, '') == ""){
            errs.firstName = true;
        }

        if(!last_name || last_name.replace(/[ ]/g, '') == ""){
            errs.lastName = true;
        }

        if(!store_name || store_name.replace(/[ ]/g, "") == ""){
            errs.store_name = true;
        }
        
        
        if(!email || !emailRegex.test(email)) {
            errs.email = true;
        }

        if(!password || password.length < 6) {
            errs.password = true;
        }

        if(password !== confirmPassword) {
            errs.confirmPassword = true;
        }

        setErrors(errs);

        if(Object.values(errs).some(Boolean)) {
            setLoading(false);
            return;
        }

        try {
            const {data: authData, error: authError} = await supabase.auth.signUp({
                email,
                password,
            });

            if(authError) {
                throw new Error(authError.message);
            }

            if(!authData.user) {
                throw new Error("User creation failed");
            }

            const {error} = await supabase.from('profiles').upsert({
                id: authData.user.id,
                first_name,
                last_name,
                store_name,
            }).select('id, store_name');

            if(error){
                throw new Error(error.message);
            }

            console.log("Account created successfully.");

            navigate('/');
        } catch (error) {
            console.error((error as Error).message)
        }finally{
            setLoading(false);
        }
    }

  return (
    <main className="simpleMains">
      <motion.form
        initial={{opacity: 0, y: -300}}
        animate={{opacity: 1, y: 0}}
        transition={{type:"spring", stiffness: 35, ease: "easeInOut", }} 
        className="simpleForms shadow" 
        onSubmit={handleSubmit}
      >
        <h1 className="text-4xl font-bold">Sign-up</h1>
        
        <div className="flex gap-2">
            <div className="flex flex-col">
                <input onChange={() => setErrors(prev => ({...prev, firstName: false}))} type="text" name="firstName" placeholder="First Name"/>
                {errors.firstName && <small className="text-red-500">First Name is required*</small>}
            </div>
            <div className="flex flex-col">
                <input onChange={() => setErrors(prev => ({...prev, lastName: false}))} type="text" name="lastName" placeholder="Last Name"/>
                {errors.lastName && <small className="text-red-500">Last Name is required*</small>}
            </div>
        </div>
        
        <div className="flex flex-col">
            <input type="email" name="email" placeholder="Email" autoComplete="off" onChange={() => setErrors(prev => ({...prev, email: false}))}/>
            {errors.email && <small className="text-red-500">Invalid email address*</small>}
        </div>
        
        <div className="flex flex-col">
            <input onChange={() => setErrors(prev => ({...prev, store_name: false}))} className="w-full" name="storeName" type="text" placeholder="Store Name"/>
            {errors.store_name && <small className="text-red-500">Store name is required*</small>}
        </div>
        
        <div className="relative">
            <button type="button" onClick={() => setHidden(!hidden)} className="absolute right-3 top-3 hover:cursor-pointer active:cursor-default">
                {hidden
                    ? <EyeClosed/>
                    : <Eye/>
                }
            </button>
            <input type={hidden ? "password" : "text"} name="password" placeholder="Password" autoComplete="off" className="pe-[40px]! w-full" onChange={() => setErrors(prev => ({...prev, password: false, confirmPassword: false}))}/>
        </div>
        {errors.password && <small className="text-red-500">Password must be at least 7 characters*</small>}
        
        
        <div className="flex flex-col">
            <input type={hidden ? "password" : "text"} name="confirmPassword" placeholder="Confirm Password" autoComplete="off" onChange={() => setErrors(prev => ({...prev, password: false, confirmPassword: false}))}/>
            {errors.confirmPassword && <small className="text-red-500">Passwords do not match*</small>}
        </div>
        {!loading
            ? <button className="submitBtn">Submit</button>
            : <div className="loadingBtn">Loading</div>
        }

        <div className="flex justify-center items-center">
            <p>Already have an account? <span onClick={() => navigate('/')} className="text-blue-500 hover:cursor-pointer font-bold underline">Login</span></p>
        </div>
      </motion.form>
    </main>
  )
}

export default SignUp
