import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

function Navbar() {

  const { user, logout } = useContext(AuthContext);
  const getNavLinkClass = ({ isActive }) => {
    return isActive ? 'nav-link active' : 'nav-link';
  }
  return (
    <nav>
      <div className='nav-container'>
        <div className='logo'>
            <Link to='/'>Notes App</Link>
        </div>
        <div className='nav-links'>
          {          
            user ? (
              <>
                <span>Welcome {user.user.username}!</span>
                <NavLink to='/dashboard' className={getNavLinkClass}>Dashboard</NavLink>
                <NavLink to='/profile' className={getNavLinkClass}>Profile</NavLink>
                <button onClick={() => logout()}>Logout</button>
              </>
              ) : (
              <>
                <NavLink to='/login' className={getNavLinkClass}>Login</NavLink>
                <NavLink to='/register' className={getNavLinkClass}>Register</NavLink>
              </>
              )
          }
        </div>
      </div>
    </nav>
  )
}

export default Navbar;