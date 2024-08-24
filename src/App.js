
import './App.scss';
import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HotelDetails from './routes/hotel-details/HotelDetails';
import Login from './routes/login/Login';
import Register from './routes/register/Register';
import AboutUs from './routes/about-us/AboutUs';

import ForgotPassword from './routes/forgot-password/ForgotPassword';
import Checkout from './routes/checkout/Checkout';
import BookingConfirmation from './routes/booking-confimation/BookingConifrmation';
import UserProfile from './routes/user-profile/UserProfile';
import { AuthProvider } from './contexts/AuthContext';

import BaseLayout from './layouts/BaseLayout';
import Home from './pages/Home';
import HotelsSearch from './pages/HotelsSearch';

const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      // {
      //   path: '/hotels',
      //   element: <HotelsSearch />,
      // },
      // {
      //   path: '/about-us',
      //   element: <AboutUs />,
      // },
      // {
      //   path: '/user-profile',
      //   element: <UserProfile />,
      // },
      // {
      //   path: '/login',
      //   element: <Login />,
      // },
      // {
      //   path: '/register',
      //   element: <Register />,
      // },
      // {
      //   path: '/hotel/:hotelId',
      //   element: <HotelDetails />,
      // },
      // {
      //   path: '/forgot-password',
      //   element: <ForgotPassword />,
      // },
      // {
      //   path: '/checkout',
      //   element: <Checkout />,
      // },
      // {
      //   path: '/booking-confirmation',
      //   element: <BookingConfirmation />,
      // },
    ],
  },
]);

function App() {


  useEffect(() => {
    // dispath(actionGetAllRoom())
  }, [])

  return (
    <>
    <div>
    {/* {`${JSON.stringify(rooms)}`} */}
    </div>
      
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
