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
  
  const isLogined = ()=>{
	  return localStorage.getItem("access_token") || false
  }

  const handleLogout = async () => {
    if (isLogined())
      await dispatch(actionLogout())
    navigate(RouteName.LOGIN.path)
  };

  const dropdownOptions = [
    { name: 'Hồ sơ cá nhân', onClick: () => navigate(RouteName.USER_PROFILE.path) },
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
          GIỚI THIỆU
        </Link>
      </li>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to={RouteName.HOTELS.path}
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive(RouteName.HOTELS.path) && 'active-link'
            }`}
          onClick={onHamburgerMenuToggle}
        >
          CÁC LOẠI PHÒNG
        </Link>
      </li>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to={RouteName.ABOUT_US.path}
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive(RouteName.ABOUT_US.path) && 'active-link'
            }`}
          onClick={onHamburgerMenuToggle}
        >
          VỀ CHÚNG TÔI
        </Link>
      </li>
      <li
        className={`${!isLogined() && 'p-4 hover:bg-blue-900 md:hover:bg-brand'}`}
      >
        {isLogined() ? (
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