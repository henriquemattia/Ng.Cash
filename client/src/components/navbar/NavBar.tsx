import React from 'react';

import ngcash from '../../imgs/NgCash.png'
import './navbar.css'

const NavBar: React.FC = () => {
  return (
    <div className='navbar'>
            <img src={ngcash} alt="" className='nav-logo'/>
            <button className="logout">Logaoti</button>
    </div>
  )
}

export default NavBar;