import React, { useEffect, useState } from 'react';
import FinalBookingSummary from './components/final-booking-summary/FinalBookingSummary';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useSearchParams } from 'react-router-dom';


import { useDispatch, useSelector } from 'react-redux';
import { actionCheckout, actionSetResultBooking, actionClearBooking } from '../../redux/features/room/roomSlice'
import { BOOKING_STATUS } from '../../utils/constants'
import Payment from './components/Payment';
import BookingPacket from './components/BookingPacket';
import BookingResult from './components/BookingResult';


import { Steps } from 'antd';

import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';



const Checkout = () => {
  const dispatch = useDispatch()
  const { resultBooking, booking, dateRange } = useSelector(state => {
    return state.room
  })

  const { tempBooking } = useSelector(state => {
    return state.room
  })


  const location = useLocation();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

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

  const [currentStep,setCurrentStep] = useState(0)

  const checkInDateTime = `${searchParams.get('checkIn')} `
  const checkOutDateTime = `${searchParams.get('checkOut')}`
  const numberGuests = `${searchParams.get('guests')}`
  const numberRooms = `${searchParams.get('rooms')}`

  useEffect(() => {
    const locationState = location.state;
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    if (!locationState || !checkIn || !checkOut) {
      const hotelCode = searchParams.get('hotelCode');
      navigate(`/booking/${hotelCode}`);
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

      const hotelName = searchParams.get('hotelName').replaceAll('-', '_');
      navigate(`/booking-confirmation?payment=sucess&hotel=${hotelName}`, {
        state: {
          confirmationData: [{ label: "ok", value: 1 }],
        },
      });
    }
    if (resultBooking?.status == BOOKING_STATUS.CANCEL.id) {
      setPaymentConfirmationDetails({
        isLoading: false,
        data: {},
      })
      setIsSubmitDisabled(false)
    }
  }, [resultBooking])

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      "payment_amount": 100,
      "address": formData.address,
      "email": formData.email,
      "city": formData.city,
      "post_code": formData.postalCode,
      "state": formData.state
    }

    let newBooking = { ...tempBooking, "checkin_at": checkInDate, "checkout_at": checkOutDate, "payment": payment }

    dispatch(actionCheckout(newBooking))
  };

  const handleChangeStep = (e) => {
    setCurrentStep(e)
  }

  const hashStep = [
    <Payment
      setFormData={setFormData}
      paymentConfirmationDetails={paymentConfirmationDetails}
      formData={formData}
      total={location?.state?.total}
      isSubmitDisabled={isSubmitDisabled}
      handleSubmit={handleSubmit}
    ></Payment>,
    <BookingPacket></BookingPacket>,
    <BookingResult></BookingResult>
  ]

  return (
    <div className="flex flex-col justify-center items-center">
      <FinalBookingSummary
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
          onChange={handleChangeStep}
          current={currentStep}
          items={[
            {
              // status: 'process',
              title: 'Payment Info',
            },
            {
              // status: 'wait',
              title: 'Confirm Information',
            },
            {
              // status: 'wait',
              title: 'Waiting',
            },
          ]}
        />
      </div>
          {hashStep[currentStep]}



    </div>
  );
};




export default Checkout;
