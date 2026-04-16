import { useState, type SubmitEvent } from "react";

const SignUp = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        try {
            const formData = new FormData(e.currentTarget);
            const firstName = formData.get("firstName") as string;
            const lastName = formData.get("lastName") as string;
            const storeName = formData.get("storeName") as string;
            const bio = formData.get('bio') as string;

            console.log(firstName, lastName, storeName, bio);
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
        <div className="flex gap-3">
            <input type="text" name="firstName" placeholder="First Name"/>
            <input type="text" name="lastName" placeholder="Last Name"/>
        </div>
        <input type="text" name="storeName" placeholder="Store Name" autoComplete="off"/>
        <textarea name="bio" placeholder="Bio" autoComplete="off"/>
        <button className="">Submit</button>
      </form>
    </main>
  )
}

export default SignUp
