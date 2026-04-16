import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import FrontPage from './pages/FrontPage/FrontPage'
import PageNotFound from './pages/PageNotFound'
import SignUp from './pages/SignUp/SignUp'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<FrontPage/>}/>
        <Route path='/signUp' element={<SignUp/>}/>
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
