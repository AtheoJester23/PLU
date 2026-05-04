import { Link } from "react-router-dom"

const PageNotFound = () => {
  return (
    <main className="flex justify-center items-center h-screen flex-col gap-5">
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p>This page does is unavaliable at the moment or non existent.</p>
        <Link to={"/"} className="bg-nav px-5 py-2 rounded text-white font-bold -translate-y-0.25 hover:translate-none duration-200">
            Go Back
        </Link>
    </main>
  )
}

export default PageNotFound
