import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import FrontPage from './pages/FrontPage/FrontPage'
import PageNotFound from './pages/PageNotFound'
import SignUp from './pages/SignUp/SignUp'
import Home from './pages/Home/Home'
import MainLayout from './layout/MainLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<FrontPage/>}/>
        <Route path='/signUp' element={<SignUp/>}/>
        <Route element={<MainLayout/>}>
          <Route path='/home' element={<Home/>}/>
        </Route>
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
