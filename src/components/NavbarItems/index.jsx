import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useContext } from 'react';
import DropdownButton from '../ux/DropdownButton';


const NavbarItems = ({ onHamburgerMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();


  /**
   * Handles the logout action by calling the logout API and updating the authentication state.
   */
  const handleLogout = async () => {
    // await networkAdapter.post('api/users/logout');
    // context.triggerAuthCheck();
    // navigate('/login');
  };

  const dropdownOptions = [
    { name: 'Profile', onClick: () => navigate('/user-profile') },
    { name: 'Logout', onClick: handleLogout },
  ];


  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to="/"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/') && 'active-link'
            }`}
          onClick={onHamburgerMenuToggle}
        >
          Home
        </Link>
      </li>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to="/hotels"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/hotels') && 'active-link'
            }`}
          onClick={onHamburgerMenuToggle}
        >
          Hotels
        </Link>
      </li>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to="/about-us"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/about-us') && 'active-link'
            }`}
          onClick={onHamburgerMenuToggle}
        >
          About us
        </Link>
      </li>
      <li className='p-4 hover:bg-blue-900 md:hover:bg-brand'>

      <Link
        to="/login"
        className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/login') && 'active-link'
          }`}
        onClick={onHamburgerMenuToggle}
      >
        Login/Register
      </Link>
      </li>
      {/* <li
        className={`${!isAuthenticated && 'p-4 hover:bg-blue-900 md:hover:bg-brand'}`}
      >
        {isAuthenticated ? (
          <DropdownButton triggerType="click" options={dropdownOptions} />
        ) : (
          <Link
            to="/login"
            className={`uppercase font-medium text-slate-100 hover-underline-animation ${
              isActive('/login') && 'active-link'
            }`}
            onClick={onHamburgerMenuToggle}
          >
            Login/Register
          </Link>
        )}
      </li> */}
    </>
  );
};

export default NavbarItems;