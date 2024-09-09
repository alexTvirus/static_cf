import React from 'react';
import Loader from '../../../../components/ux/loader/loader';
import PaymentInFo from '../PaymentInfo'

const BookingConfirm = ({ onConfirm, paymentConfirmationDetails, formData }) => {
  return (
    <div className="bg-white border-gray-200 border rounded-lg p-6 mb-6 shadow w-full max-w-lg mx-auto mt-4">
      {paymentConfirmationDetails.isLoading && (
        <Loader
          isFullScreen={true}
          loaderText={'Payment in progress, hold tight!'}
        />
      )}
      <div className={` ${paymentConfirmationDetails.isLoading ? 'opacity-40' : ''
        } mb-4`}>
        <PaymentInFo
          formData={formData}
        ></PaymentInFo>
        <button className='bg-brand transition duration-300 text-white py-2 rounded w-full' 
        onClick={onConfirm}>Xác nhận</button>

      </div>
    </div>
  );
};

export default BookingConfirm;
