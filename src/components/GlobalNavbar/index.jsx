import logo from '../../assests/logos/stay_booker_logo.png';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import NavbarItems from '../../components/NavbarItems';
import HamburgerMenu from '../../components/HamburgerMenu';

const GlobalNavbar = () => {
  const [isVisible, setIsVisible] = useState(false);

  const onHamburgerMenuToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="relative flex flex-wrap justify-between items-center px-4 md:px-12 global-navbar__container brand-divider-bottom shadow-md">
      <div className="flex">
        {/* <Link to="/">
          <img src={logo} alt="site logo" className="site-logo__img" />
        </Link> */}
      </div>
      <ul className="list-none hidden md:flex">
        <NavbarItems />
      </ul>
      <FontAwesomeIcon
        data-testid="menu-toggle__button"
        icon={faBars}
        size="2x"
        color="#fff"
        className="block md:hidden"
        onClick={onHamburgerMenuToggle}
      />
      <HamburgerMenu
        isVisible={isVisible}
        onHamburgerMenuToggle={onHamburgerMenuToggle}
      />
    </div>
  );
};

export default GlobalNavbar;
