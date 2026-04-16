import { Eye, EyeClosed } from "lucide-react";
import { useState, type SubmitEvent } from "react";

const SignUp = () => {
    const [hidden, setHidden] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        try {
            const formData = new FormData(e.currentTarget);
            const firstName = formData.get("firstName") as string;
            const lastName = formData.get("lastName") as string;
            const email = formData.get("email") as string;
            const storeName = formData.get("storeName") as string;

            console.log(firstName, lastName, email, storeName);
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
        {/* <div className="flex gap-3">
            <input type="text" name="firstName" placeholder="First Name"/>
            <input type="text" name="lastName" placeholder="Last Name"/>
        </div> */}
        <input type="email" name="email" placeholder="Email" autoComplete="off"/>
        {/* <input type="text" name="storeName" placeholder="Store Name" autoComplete="off"/> */}
        <div className="relative">
            <button type="button" onClick={() => setHidden(!hidden)} className="absolute right-3 top-3 hover:cursor-pointer active:cursor-default">
                {hidden
                    ? <EyeClosed/>
                    : <Eye/>
                }
            </button>
            <input type={hidden ? "password" : "text"} name="password" placeholder="Password" autoComplete="off" className="pe-[40px]!"/>
        </div>
        <input type={hidden ? "password" : "text"} name="confirmPassword" placeholder="Confirm Password" autoComplete="off"/>
        {!loading
            ? <button className="submitBtn">Submit</button>
            : <div className="loadingBtn">Loading</div>
        }
      </form>
    </main>
  )
}

export default SignUp
