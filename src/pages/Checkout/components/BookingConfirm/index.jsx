import React from 'react';
import OverlayComponent from '../../../../components/OverLay'
import PaymentInFo from '../PaymentInfo'

const BookingConfirm = ({ onConfirm, paymentConfirmationDetails, formData }) => {
  return (
    <div className="bg-white border-gray-200 border rounded-lg p-6 mb-6 shadow w-full max-w-lg mx-auto mt-4">
      <OverlayComponent
        isLoading={paymentConfirmationDetails.isLoading}
      ></OverlayComponent>
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
