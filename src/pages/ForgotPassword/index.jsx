import { useState } from 'react';
import { Link } from 'react-router-dom';

import validations from '../../utils/validations';
import Toast from '../../components/ux/toast/Toast';
import { RouteName } from '../../routes/RouteName';
import { useDispatch, useSelector } from 'react-redux';
import { actionForgotPassword } from '../../redux/features/auth/authSlice';

import OverlayComponent from '../../components/OverLay'

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const { isLoading } = useSelector(state => {
    return state.auth
  })

  const [loginData, setLoginData] = useState({
    email: '',
  });

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleforgotsubmit = async (e) => {
    e.preventDefault();
    dispatch(actionForgotPassword(loginData))
  };
  return (
    <>
      <OverlayComponent
        isLoading={isLoading}
      ></OverlayComponent>
      <div>
        <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
          <form
            onSubmit={handleforgotsubmit}
            className="w-full max-w-lg p-4 md:p-10 shadow-md"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-brand my-4">
                Khôi phục lại mật khẩu
              </h2>
              <div className="mb-6">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={handleInputChange}
                  autoComplete="username"
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                />
                <p className="text-gray-700">
                  Chúng tôi sẽ gửi mã xác nhận đến email này, hãy kiểm tra hòm thư
                  kể cả hòm thư rác.
                </p>
              </div>
              <div className="flex-wrap items-center justify-between">
                <button
                  type="submit"
                  className="w-full bg-brand hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Khôi phục mật khẩu
                </button>
                <div className="mt-5">
                  <Link
                    to={RouteName.LOGIN.path}
                    className="inline-block align-baseline text-lg text-gray-500 hover:text-blue-800 text-right"
                  >
                    Quay về trang đăng nhập
                  </Link>
                </div>
              </div>
            </div>
          </form>

        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
