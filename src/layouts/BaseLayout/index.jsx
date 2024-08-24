
import { Outlet } from 'react-router-dom';
import GlobalNavbar from '../../components/GlobalNavbar';
import GlobalFooter from '../../components/GlobalFooter';


/**
 * BaseLayout Component
 * Renders the base layout for the application.
 * It includes the global navbar, the main content, and the global footer.
 * @returns {JSX.Element} - The BaseLayout component.
 */
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
