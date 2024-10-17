
import './App.scss';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';


import BaseLayout from './layouts/BaseLayout';
import Home from './pages/Home';
import HotelsSearch from './pages/HotelsSearch';
import AboutUs from './pages/AboutUs';
import HotelDetails from './pages/HotelDetails';
import Booking from './pages/Booking';
import BookingTour from './pages/BookingTour';
import ContactUs from './pages/ContactUs';
import Tours from './pages/Tours';

import Checkout from './pages/Checkout';
import ForgotPassword from './pages/ForgotPassword'
import Login from './pages/Login'
import Register from './pages/Register'
import UserProfile from './pages/UserProfile'

import { history } from './routes/helper/history';
import { RouteName } from './routes/RouteName';

import { PrivateRoute } from './routes/PrivateRoutes';
import { useDispatch } from 'react-redux';

function App() {

  history.navigate = useNavigate();
  history.location = useLocation();
  history.params = useParams();

  return (
    <>
      <Routes>
        <Route path='/' element={<BaseLayout >
        </BaseLayout>} >

          <Route path='/' element={
            <Home />
          } />

          <Route path={RouteName.HOTELS.path} element={
            <HotelsSearch />
          } />

          <Route path={RouteName.TOURS.path} element={
            <Tours />
          } />

          <Route path={RouteName.ABOUT_US.path} element={
            <AboutUs />
          } />

          <Route path={`${RouteName.HOTEL_DETAIL.path}/:hotelId`} element={
            <HotelDetails />
          } />

          <Route path={`${RouteName.BOOKING.path}/:hotelId/tour/:packetId`} element={
            <BookingTour />
          } />

          <Route path={`${RouteName.BOOKING.path}/:hotelId`} element={
            <Booking />
          } />

          <Route path={`${RouteName.CONTACT_US.path}/`} element={
            <ContactUs />
          } />


          <Route path={RouteName.CHECKOUT.path} element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } />

          <Route path={RouteName.FORGOT_PASSWORD.path} element={
            <ForgotPassword />
          } />

          <Route path={RouteName.LOGIN.path} element={
            <Login />
          } />

          <Route path={RouteName.REGISTER.path} element={
            <Register />
          } />

          <Route path={RouteName.USER_PROFILE.path} element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          } />

        </Route>
      </Routes>
    </>
  );
}

export default App;
