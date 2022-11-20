import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Registro from './pages/Registro/Registro'

  function AppRouter() {
    return (
      <BrowserRouter>
        <Routes>

          <Route path='/' index element={<Home />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Registro />}/>

        </Routes>
      </BrowserRouter>
    )
  }
  
  export default AppRouter