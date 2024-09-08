import { Link, useNavigate, useLocation } from 'react-router-dom';
import { history } from '../../routes/helper/history';

import { act, useContext } from 'react';
import DropdownButton from '../ux/DropdownButton';
import { useDispatch, useSelector } from 'react-redux';
import { actionLogout } from '../../redux/features/auth/authSlice';
import { RouteName } from '../../routes/RouteName';

const NavbarItems = ({ onHamburgerMenuToggle }) => {
  const navigate = history.navigate
  const location = history.location

  const dispatch = useDispatch()
  const { isAuth } = useSelector(state => {
    return state.auth
  })

  const handleLogout = async () => {
    if (isAuth)
      await dispatch(actionLogout())
    navigate(RouteName.LOGIN.path)
  };

  const dropdownOptions = [
    { name: 'Profile', onClick: () => navigate(RouteName.USER_PROFILE.path) },
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
          to={RouteName.HOTELS.path}
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive(RouteName.HOTELS.path) && 'active-link'
            }`}
          onClick={onHamburgerMenuToggle}
        >
          Hotels
        </Link>
      </li>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to={RouteName.ABOUT_US.path}
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive(RouteName.ABOUT_US.path) && 'active-link'
            }`}
          onClick={onHamburgerMenuToggle}
        >
          About us
        </Link>
      </li>
      <li
        className={`${!isAuth && 'p-4 hover:bg-blue-900 md:hover:bg-brand'}`}
      >
        {isAuth ? (
          <DropdownButton triggerType="click" options={dropdownOptions} />
        ) : (
          <Link
            to={RouteName.LOGIN.path}
            className={`uppercase font-medium text-slate-100 hover-underline-animation ${
              isActive(RouteName.LOGIN.path) && 'active-link'
            }`}
            onClick={onHamburgerMenuToggle}
          >
            Login/Register
          </Link>
        )}
      </li>
    </>
  );
};

export default NavbarItems;