import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import React, { useContext } from 'react';

import { history } from '../../routes/helper/history';
import validations from '../../utils/validations';
import Toast from '../../components/ux/toast/Toast';
import { LOGIN_MESSAGES } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { actionLogin } from '../../redux/features/auth/authSlice';


const Login = () => {
  const navigate = history.navigate

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const { isAuth, currentUser } = useSelector(state => {
    return state.auth
  })

  const [errorMessage, setErrorMessage] = useState(false);


  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    dispatch(actionLogin(loginData))
  };

  useEffect(() => {
    if (isAuth)
      navigate("/user-profile")
  }, [isAuth])



  return (
    <>
      <div className="login__form">
        <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
          <form
            onSubmit={handleLoginSubmit}
            className="w-full max-w-lg p-4 md:p-10 shadow-md"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-brand">
                Welcome Back
              </h2>
              <p className="text-gray-500">
                Log in to continue to your account
              </p>
            </div>
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
            </div>
            <div className="mb-6">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              />
            </div>
            <div className="items-center">
              <div>
                <button
                  type="submit"
                  className="bg-brand hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                  focus:outline-none focus:shadow-outline w-full"
                >
                  Log In
                </button>
              </div>
              <div className="flex flex-wrap justify-center my-3 w-full">
                <Link
                  to="/forgot-password"
                  className="inline-block align-baseline text-md text-gray-500 hover:text-blue-800 text-right"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-0 right-0 flex justify-center items-center">
                  <div className="border-t w-full absolute"></div>
                  <span className="bg-white px-3 text-gray-500 z-10">
                    Register ?
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center my-3 w-full mt-12">
                <Link
                  to="/register"
                  className="inline-block align-baseline font-medium text-md text-brand hover:text-blue-800 text-right"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
