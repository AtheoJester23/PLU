import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"

const MainLayout = () => {
  return (
    <div className="min-h-[100dvh] flex flex-col">
        <Navbar />
        <main className="flex-1">
            <Outlet />
        </main>
    </div>
  )
}

export default MainLayout
