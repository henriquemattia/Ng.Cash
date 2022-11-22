import React from 'react';

import ngcash from '../../imgs/NgCash.png'
import './navbar.css'

import { useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const navigate = useNavigate()
    const removeToken =  () => {
      alert('Até a proxima :)')
      localStorage.removeItem("token")
      navigate('/login')
    }
  return (
    <>
    <div className='navbar'>
            <img src={ngcash} alt="" className='nav-logo'/>
            <div className='log-out_button'>
            {localStorage.getItem('token') ? <button className="logout" onClick={removeToken} >Sair</button> : null}
            </div>
            {/* <button className="logout" onClick={removeToken} >Sair</button> */}
    </div>
    
    </>
  )
}

export default NavBar;