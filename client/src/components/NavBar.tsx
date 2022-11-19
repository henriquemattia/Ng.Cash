import React from 'react';

import ngcash from '../imgs/NgCash.png'
import './navbar.css'

const NavBar: React.FC = () => {
  return (
    <div className='navbar'>
        {/* <div className='nav_logo'> */}
            <img src={ngcash} alt="" className='nav-logo'/>
        {/* </div> */}
    </div>
  )
}

export default NavBar;