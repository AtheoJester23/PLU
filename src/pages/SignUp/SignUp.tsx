import { Eye, EyeClosed } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { motion } from "framer-motion";
import supabase from "../../config/supabaseClient";

type possibleErrors = {
    firstName: boolean,
    lastName: boolean,
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
        email: false,
        password: false,
        confirmPassword: false,
    });

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

            const {data, error} = await supabase.from('profiles').upsert({
                id: authData.user.id,
                first_name,
                last_name,
                store_name,
            }).select('id, store_name');

            if(error){
                throw new Error(error.message);
            }

            console.log("Account created successfully.");
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
            <input type="text" name="firstName" placeholder="firstName"/>
            <input type="text" name="lastName" placeholder="lastName"/>
        </div>
        
        <div className="flex flex-col">
            <input type="email" name="email" placeholder="Email" autoComplete="off" onChange={() => setErrors(prev => ({...prev, email: false}))}/>
            {errors.email && <small className="text-red-500">Invalid email address*</small>}
        </div>
        
        <div>
            <input className="w-full" name="storeName" type="text" placeholder="Store Name"/>
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
      </motion.form>
    </main>
  )
}

export default SignUp
