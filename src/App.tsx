import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import FrontPage from './pages/FrontPage/FrontPage'
import PageNotFound from './pages/PageNotFound'
import SignUp from './pages/SignUp/SignUp'
import Home from './pages/Home/Home'
import MainLayout from './layout/MainLayout'
import Create from './pages/Create/Create'
import Edit from './pages/Edit/Edit'
import Menu from './pages/Menu/Menu'
import Profile from './pages/Profile/Profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<FrontPage/>}/>
        <Route path='/signUp' element={<SignUp/>}/>
        <Route element={<MainLayout/>}>
          <Route path='/home' element={<Home/>}/>
          <Route path='/create' element={<Create/>}/>
          <Route path='/edit/:id' element={<Edit/>}/>
          <Route path='/menu' element={<Menu/>}/>
          <Route path='/profile' element={<Profile/>}/>
        </Route>
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
