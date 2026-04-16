import { Eye, EyeClosed } from "lucide-react";
import { useState, type SubmitEvent } from "react";

type possibleErrors = {
    email: boolean,
    password: boolean,
    confirmPassword: boolean,
}

const SignUp = () => {
    const [hidden, setHidden] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<possibleErrors>({
        email: false,
        password: false,
        confirmPassword: false,
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        
        const errs = {...errors};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

            console.log(email, password, confirmPassword);
        } catch (error) {
            console.error((error as Error).message)
        }finally{
            setLoading(false);
        }
    }

  return (
    <main className="simpleMains">
      <form className="simpleForms shadow" onSubmit={handleSubmit}>
        <h1 className="text-4xl font-bold">Sign-up</h1>
        <div className="flex flex-col">
            <input type="email" name="email" placeholder="Email" autoComplete="off" onChange={() => setErrors(prev => ({...prev, email: false}))}/>
            {errors.email && <small className="text-red-500">Invalid email address*</small>}
        </div>
        
        <div className="relative">
            <button type="button" onClick={() => setHidden(!hidden)} className="absolute right-3 top-3 hover:cursor-pointer active:cursor-default">
                {hidden
                    ? <EyeClosed/>
                    : <Eye/>
                }
            </button>
            <input type={hidden ? "password" : "text"} name="password" placeholder="Password" autoComplete="off" className="pe-[40px]!" onChange={() => setErrors(prev => ({...prev, password: false, confirmPassword: false}))}/>
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
      </form>
    </main>
  )
}

export default SignUp
