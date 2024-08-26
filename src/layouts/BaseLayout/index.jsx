
import { Outlet } from 'react-router-dom';
import GlobalNavbar from '../../components/GlobalNavbar';
import GlobalFooter from '../../components/GlobalFooter';


const BaseLayout = () => {
  return (
    <>
      <div className='bg-brand'>
        <div className='container mx-auto'>
          <GlobalNavbar />
        </div>
      </div>

      <Outlet />

      <div className='container mx-auto'>
        <GlobalFooter />
      </div>
    </>
  );
};

export default BaseLayout;
