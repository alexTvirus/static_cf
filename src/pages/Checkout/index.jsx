import React, { useEffect, useState } from 'react';
import FinalBookingSummary from './components/final-booking-summary/FinalBookingSummary';
import { history } from '../../routes/helper/history';
import { isObjectEmpty } from '../../utils/helpers'
import { useSearchParams } from 'react-router-dom';


import { useDispatch, useSelector } from 'react-redux';
import { actionCheckout, actionSetResultBooking, actionClearBooking, actionGetAllCities } from '../../redux/features/room/roomSlice'
import { BOOKING_STATUS } from '../../utils/constants'
import Payment from './components/Payment';
import BookingConfirm from './components/BookingConfirm';
import BookingResult from './components/BookingResult';
import { RouteName } from '../../routes/RouteName';


import { Steps } from 'antd';

import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';



const Checkout = () => {
  const dispatch = useDispatch()
  const { resultBooking, booking, dateRange, cities } = useSelector(state => {
    return state.room
  })

  const { currentUser } = useSelector(state => {
    return state.auth
  })

  const { tempBooking } = useSelector(state => {
    return state.room
  })


  const navigate = history.navigate
  const location = history.location

  const [searchParams] = useSearchParams();

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

 

  const [totalPrice, setTotalPrice] = useState(0)

  const [paymentConfirmationDetails, setPaymentConfirmationDetails] = useState({
    isLoading: false,
    data: {},
  });

  const [formData, setFormData] = useState({
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [currentStep, setCurrentStep] = useState(0)

  const checkInDateTime = `${searchParams.get('checkIn')} `
  const checkOutDateTime = `${searchParams.get('checkOut')}`
  const numberGuests = `${searchParams.get('guests')}`
  const numberRooms = `${searchParams.get('rooms')}`

  useEffect(() => {
    dispatch(actionGetAllCities())
  }, [])

 

  useEffect(() => {
    if (!isObjectEmpty(currentUser)) {
      setFormData({ ...formData, email: currentUser.email })
    }
  }, [currentUser])

  useEffect(() => {
    const locationState = location.state;
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    setTotalPrice(location?.state?.total || 0)
    if (!locationState || !checkIn || !checkOut) {
      const hotelCode = searchParams.get('hotelCode');
      navigate(`${RouteName.BOOKING.path}/${hotelCode}`);
    }
  }, [location, navigate, searchParams]);

  useEffect(() => {
    if (resultBooking?.status == BOOKING_STATUS.COMPLETE.id
      || resultBooking?.status == BOOKING_STATUS.PARTIALLY_PAID.id
      || resultBooking?.status == BOOKING_STATUS.PENDING.id) {
      dispatch(actionSetResultBooking(tempBooking))
      dispatch(actionClearBooking())
      setPaymentConfirmationDetails({
        isLoading: false,
        data: {},
      })

      setCurrentStep(2)
    }
    if (resultBooking?.status == BOOKING_STATUS.CANCEL.id) {
      setPaymentConfirmationDetails({
        isLoading: false,
        data: {},
      })
      setIsSubmitDisabled(false)
    }
  }, [resultBooking])

  const handleConfirm = (e) => {
    setIsSubmitDisabled(true);
    setPaymentConfirmationDetails({
      isLoading: true,
      data: {},
    });

    const checkInDate = moment(dateRange[0].$d).format(dateFormat) ?? '';
    const checkOutDate = moment(dateRange[1].$d).format(dateFormat) ?? '';
    let payment = {
      "payment_method": "face pay",
      "payment_date": moment(new Date()).format(dateFormat),
      "payment_amount": totalPrice,
      "address": formData.address,
      "email": formData.email,
      "city": formData.city,
      "post_code": formData.postalCode,
      "state": formData.state
    }

    let newBooking = { ...tempBooking, "checkin_at": checkInDate, "checkout_at": checkOutDate, "payment": payment }

    dispatch(actionCheckout(newBooking))

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentStep(1)
  };

  const hashStep = [
    <Payment
      setFormData={setFormData}
      formData={formData}
      isSubmitDisabled={isSubmitDisabled}
      handleSubmit={handleSubmit}
    ></Payment>,
    <BookingConfirm
      paymentConfirmationDetails={paymentConfirmationDetails}
      onConfirm={handleConfirm}
      formData={formData}
    ></BookingConfirm>,
    <BookingResult></BookingResult>
  ]

  return (
    <div className="flex flex-col justify-center items-center">
      <FinalBookingSummary
        total={totalPrice}
        numberGuests={numberGuests}
        numberRooms={numberRooms}
        hotelName={searchParams.get('hotelName').replaceAll('-', ' ')}
        checkIn={checkInDateTime}
        checkOut={checkOutDateTime}
        phone={123}
        email={""}
        fullName={""}
      />
      <div className="relative bg-white border shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full 
      max-w-4xl mx-auto mt-4">

        <Steps
          current={currentStep}
          items={[
            {
              title: 'Thông tin thanh toán',
            },
            {
              title: 'Xác nhận thông tin thanh toán',
            },
            {
              title: 'Hoàn thành',
            },
          ]}
        />
      </div>
      {hashStep[currentStep]}
    </div>
  );
};


export default Checkout;
