import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { history } from '../../routes/helper/history';
import Toast from '../../components/ux/toast/Toast';
import { REGISTRATION_MESSAGES } from '../../utils/constants';
import { Formik, Form, Field } from 'formik';
import Schemas from '../../utils/validation-schemas';
import { useDispatch, useSelector } from 'react-redux';
import { actionRegister } from '../../redux/features/auth/authSlice';
import _debounce from 'lodash/debounce';
import { RouteName } from '../../routes/RouteName';


const Register = () => {
  const navigate = history.navigate
  const location = history.location
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch()
  const { isLoading } = useSelector(state => state.auth)
  const [registerData,setRegisterData] = useState({});
  const [executeDebouncer, setExecuteDebouncer] = useState(false);


  const debounceFn = useCallback(_debounce(() => setExecuteDebouncer(true), 1500), []);

  const handleSubmit = async (values) => {
    setRegisterData(values)
    debounceFn();
  };

  useEffect(() => {
    if (executeDebouncer) {
      setExecuteDebouncer(false);
      dispatch(actionRegister(registerData))
    }
  }, [executeDebouncer]);

  return (
    <>
      <div className="register__form">
        <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
          <Formik
            initialValues={{
              first_name: '',
              last_name: '',
              email: '',
              phone: '',
              password: '',
              password_confirmation: '',
            }}
            validationSchema={Schemas.signupSchema}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="w-full max-w-lg p-4 shadow-md md:p-10">
                  <div className="mb-10 text-center">
                    <h2 className="text-3xl font-extrabold text-brand">
                      Đăng kí
                    </h2>
                    <p className="text-gray-500">
                      Tạo tài khoản mới
                    </p>
                  </div>
                  <div className="flex flex-wrap mb-6 -mx-3">
                    <div className="w-full px-3 mb-6 md:w-1/2 md:mb-0 relative">
                      <Field
                        name="first_name"
                        placeholder="First Name"
                        autoComplete="given-name"
                        className={`${errors.first_name && touched.first_name ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                      />
                    </div>
                    <div className="w-full px-3 md:w-1/2">
                      <Field
                        name="last_name"
                        placeholder="Last Name"
                        autoComplete="family-name"
                        className={`${errors.last_name && touched.last_name ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <Field
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      className={`${errors.email && touched.email ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                    />
                  </div>
                  <div className="mb-6">
                    <Field
                      name="phone"
                      placeholder="Phone"
                      autoComplete="tel"
                      className={`${errors.phone && touched.phone ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                    />
                  </div>
                  <div className="mb-6">
                    <Field
                      name="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      className={`${errors.password && touched.password ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                    />
                  </div>
                  <div className="mb-6">
                    <Field
                      name="password_confirmation"
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      className={`${errors.password_confirmation && touched.password_confirmation ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                    />
                  </div>
                  <div className="flex items-center w-full my-3">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 font-bold text-white rounded bg-brand hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                    >
                      Đăng kí
                    </button>
                  </div>
                  <Link
                    to={RouteName.LOGIN.path}
                    className="inline-block w-full text-lg text-center text-gray-500 align-baseline hover:text-blue-800"
                  >
                    Quay về trang đăng nhập
                  </Link>
                  {showToast && (
                    <Toast
                      type={toastType}
                      message={toastMessage}
                      dismissError
                    />
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Register;
