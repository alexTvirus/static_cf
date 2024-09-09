import { useState } from 'react';
import { Link } from 'react-router-dom';

import validations from '../../utils/validations';
import Toast from '../../components/ux/toast/Toast';
import { RouteName } from '../../routes/RouteName';

const ForgotPassword = () => {
  const [success, setsuccess] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
  });
  const [errorMessage, setErrorMessage] = useState(false);

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  const dismissError = () => {
    setErrorMessage('');
  };

  const handleforgotsubmit = async (e) => {
    e.preventDefault();

    // if (validations.validate('email', loginData.email)) {
    //   const response = '/api/forgot'
    //   if (response) {
    //     setsuccess(true);
    //   } else {
    //     setErrorMessage('Invalid email.');
    //   }
    // } else {
    //   setErrorMessage('Invalid email.');
    // }
  };
  return (
    <>
      <div>
        <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
          {success ? (
            <div className="bg-white p-6  md:mx-auto">
              <svg
                viewBox="0 0 24 24"
                className="text-green-600 w-16 h-16 mx-auto my-6"
              >
                <path
                  fill="currentColor"
                  d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                ></path>
              </svg>
              <div className="text-center">
                <h3 className="md:text-2xl text-base text-gray-700 font-semibold text-center">
                  Recovery Email has been sent!
                </h3>
                <p className="text-green-500">
                  {' '}
                  Don't forgot to check you spam{' '}
                </p>
                <div className="my-6  text-center">
                  <Link
                    to="/"
                    className="px-12 bg-brand hover:bg-indigo-500 text-white font-semibold py-3"
                  >
                    GO BACK
                  </Link>
                </div>
              </div>
            </div>
          ) : (
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
                {errorMessage && (
                  <Toast
                    type="error"
                    message={errorMessage}
                    dismissError={dismissError}
                  />
                )}
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
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
