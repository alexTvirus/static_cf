
import './App.scss';
import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';

import BaseLayout from './layouts/BaseLayout';
import Home from './pages/Home';
import HotelsSearch from './pages/HotelsSearch';
import AboutUs from './pages/AboutUs';
import HotelDetails from './pages/HotelDetails';
import Booking from './pages/Booking';
import Checkout from './pages/Checkout';
// import BookingConfirmation from './routes/booking-confimation/BookingConifrmation';

const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/hotels',
        element: <HotelsSearch />,
      },
      {
        path: '/about-us',
        element: <AboutUs />,
      },
      {
        path: '/hotel/:hotelId',
        element: <HotelDetails />,
      },
      {
        path: '/booking/:hotelId',
        element: <Booking />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
      // {
      //   path: '/booking-confirmation',
      //   element: <BookingConfirmation />,
      // },
    ],
  },
]);

function App() {

  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
