import React from 'react';
import Loader from '../../../../components/ux/loader/loader';

const BookingConfirm = ({ onConfirm, paymentConfirmationDetails }) => {
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
        <button onClick={onConfirm}>confirm</button>
        <h3 className="text-2xl font-bold text-gray-800">"result"</h3>
      </div>
    </div>
  );
};

export default BookingConfirm;
