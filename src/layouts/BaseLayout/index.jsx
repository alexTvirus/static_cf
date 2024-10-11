
import { Outlet } from 'react-router-dom';
import GlobalNavbar from '../../components/GlobalNavbar';
import GlobalFooter from '../../components/GlobalFooter';
import { useDispatch, useSelector } from 'react-redux';
import { isObjectEmpty } from '../../utils/helpers';
import { actionReLogin } from '../../redux/features/auth/authSlice';

const BaseLayout = () => {
  const {currentUser, isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch()

  const access_token = localStorage.getItem("access_token") || ""

  if (access_token && isObjectEmpty(currentUser) && !isLoading) {
    dispatch(actionReLogin())
  }

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
