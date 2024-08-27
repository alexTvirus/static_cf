import React, { useEffect, useState } from 'react';
import FinalBookingSummary from './components/final-booking-summary/FinalBookingSummary';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getReadableMonthFormat } from '../../utils/date-helpers';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';
import Loader from '../../components/ux/loader/loader';
import Toast from '../../components/ux/toast/Toast';
import { Card, Col, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { actionCheckout, actionSetResultBooking } from '../../redux/features/room/roomSlice'
import { BOOKING_STATUS } from '../../utils/constants'

const Checkout = () => {
  const dispatch = useDispatch()
  const { resultBooking,booking } = useSelector(state => {
    return state.room
  })

  const [errors, setErrors] = useState({});

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

  const checkInDateTime = `${searchParams.get('checkIn')} `
  const checkOutDateTime = `${searchParams.get('checkOut')}`
  const numberGuests = `${searchParams.get('guests')}`
  const numberRooms = `${searchParams.get('rooms')}`

  useEffect(() => {
    debugger
    const locationState = location.state;
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    if (!locationState || !checkIn || !checkOut) {
      const hotelCode = searchParams.get('hotelCode');
      navigate(`/booking/${hotelCode}`);
    }


  }, [location, navigate, searchParams]);



  useEffect(() => {
    if (resultBooking?.status?.id == BOOKING_STATUS.COMPLETE.id) {
      dispatch(actionSetResultBooking({}))
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
  }, [resultBooking])



  const handleChange = (e) => {
    const { name, value } = e.target;
    const isValid = validationSchema[name](value);
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: !isValid });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      const isFieldValid = validationSchema[field](formData[field]);
      newErrors[field] = !isFieldValid;
      isValid = isValid && isFieldValid;
    });

    setErrors(newErrors);

    if (!isValid) {
      return; // Stop form submission if there are errors
    }

    setIsSubmitDisabled(true);
    setPaymentConfirmationDetails({
      isLoading: true,
      data: {},
    });
    dispatch(actionCheckout(booking))
  };

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
      <div className="relative bg-white border shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg mx-auto">
        {paymentConfirmationDetails.isLoading && (
          <Loader
            isFullScreen={true}
            loaderText={'Payment in progress, hold tight!'}
          />
        )}
        <form
          onSubmit={handleSubmit}
          className={` ${paymentConfirmationDetails.isLoading ? 'opacity-40' : ''
            }`}
        >
          <InputField
            label="Email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required={true}
            error={errors.email}
          />
          <InputField
            label="Address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street Address"
            required={true}
            error={errors.address}
          />
          <InputField
            label="City"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            required={true}
            error={errors.city}
          />
          <div className="flex mb-4 justify-between">
            <InputField
              label="State / Province"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              required={true}
              error={errors.state}
            />
            <InputField
              label="Postal code"
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Postal Code"
              required={true}
              error={errors.postalCode}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className={`bg-brand hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300 ${isSubmitDisabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-700'
                }`}
              type="submit"
              disabled={isSubmitDisabled}
            >
              Pay  {location.state?.total}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};


const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
}) => (
  <div className="mb-4">
    <label
      className="block text-gray-700 text-sm font-bold mb-2"
      htmlFor={name}
    >
      {label}
    </label>
    <input
      className={`shadow appearance-none border ${error ? 'border-red-500' : 'border-gray-300'
        } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      aria-invalid={error ? 'true' : 'false'}
    />
    {error && (
      <p className="text-red-500 text-xs my-1">Please check this field.</p>
    )}
  </div>
);

// Validation schema for form fields
const validationSchema = {
  email: (value) => /\S+@\S+\.\S+/.test(value),
  nameOnCard: (value) => value.trim() !== '',
  cardNumber: (value) => /^\d{16}$/.test(value), // Simplistic validation: just check if it has 16 digits.
  expiry: (value) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value), // MM/YY format
  cvc: (value) => /^\d{3,4}$/.test(value), // 3 or 4 digits
  address: (value) => value.trim() !== '',
  city: (value) => value.trim() !== '',
  state: (value) => value.trim() !== '',
  postalCode: (value) => /^\d{5}(-\d{4})?$/.test(value),
};

export default Checkout;
