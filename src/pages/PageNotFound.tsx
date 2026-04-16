import { Link } from "react-router-dom"

const PageNotFound = () => {
  return (
    <div>
        <h1>Page Not Found</h1>
        <small>This page does is unavaliable at the moment or non existent.</small>
        <Link to={"/"}>
            Go Back
        </Link>
    </div>
  )
}

export default PageNotFound
