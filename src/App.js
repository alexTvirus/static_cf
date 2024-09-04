
import './App.scss';
import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


import BaseLayout from './layouts/BaseLayout';
import Home from './pages/Home';
import HotelsSearch from './pages/HotelsSearch';
import AboutUs from './pages/AboutUs';
import HotelDetails from './pages/HotelDetails';
import Booking from './pages/Booking';
import Checkout from './pages/Checkout';
import ForgotPassword from './pages/ForgotPassword'
import Login from './pages/Login'
import Register from './pages/Register'
import UserProfile from './pages/UserProfile'

import { history } from './routes/helper/history';

function App() {

  history.navigate = useNavigate();
  history.location = useLocation();

  return (
    <>
      <Routes>
        <Route path='/' element={<BaseLayout >
        </BaseLayout>} >

          <Route path='/' element={
            <Home />
          } />

          <Route path='/hotels' element={
            <HotelsSearch />
          } />

          <Route path='/about-us' element={
            <AboutUs />
          } />

          <Route path='/hotel/:hotelId' element={
            <HotelDetails />
          } />

          <Route path='/booking/:hotelId' element={
            <Booking />
          } />

          <Route path='/checkout' element={
            <Checkout />
          } />

          <Route path='/forgot-password' element={
            <ForgotPassword />
          } />

          <Route path='/login' element={
            <Login />
          } />

          <Route path='/register' element={
            <Register />
          } />

          <Route path='/user-profile' element={
            <UserProfile />
          } />

        </Route>
      </Routes>
    </>
  );
}

export default App;
