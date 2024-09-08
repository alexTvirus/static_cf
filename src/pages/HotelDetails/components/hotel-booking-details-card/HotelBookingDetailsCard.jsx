import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { differenceInCalendarDays } from 'date-fns';
import DateRangePicker from '../../../../components/ux/data-range-picker/DateRangePicker';
import { DEFAULT_TAX_DETAILS } from '../../../../utils/constants';
import { history } from '../../../../routes/helper/history';
import queryString from 'query-string';
import { formatPrice } from '../../../../utils/price-helpers';
import Toast from '../../../../components/ux/toast/Toast';
import format from 'date-fns/format';
import { RouteName } from '../../../../routes/RouteName';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';

const HotelBookingDetailsCard = ({ hotelCode }) => {

  const navigate = history.navigate

  // State for error message
  const [errorMessage, setErrorMessage] = useState('');


  const onBookingConfirm = () => {
    navigate(`${RouteName.BOOKING.path}/${hotelCode}`);
  };

  // Handler for dismissing error message
  const dismissError = () => {
    setErrorMessage('');
  };


  // Effect for fetching booking details
  useEffect(() => {
    // const getBookingDetails = async () => {
    //   const response = await networkAdapter.get(
    //     `api/hotel/${hotelCode}/booking/enquiry`
    //   );
    //   if (response && response.data) {
    //     setBookingDetails(response.data);
    //   }
    // };
    // getBookingDetails();
  }, [hotelCode]);

  return (
    <div className="mx-2 bg-white shadow-xl rounded-xl overflow-hidden mt-2 md:mt-0 w-full md:w-[380px]">
      <div className="px-6 py-4 bg-brand text-white">
        <h2 className="text-xl font-bold">Infomation</h2>
      </div>
      <div className="p-6 text-sm md:text-base">
        <div className="mb-4">
          <div className="text-lg font-semibold text-gray-800 mb-1">
            Free transit
          </div>
        </div>

        <div className="mb-4">
          <div className="font-semibold text-gray-800">Check in at: 02:00 PM</div>
        </div>

        <div className="mb-4">
          <div className="font-semibold text-gray-800">Check out at: 11:00 AM</div>

        </div>

        <div className="mb-4">
          <div className="font-semibold text-gray-800">Provide Special Assistance</div>
        </div>

        <div className="mb-4">
          <div className="font-semibold text-gray-800">Room Service</div>
        </div>

    

        {errorMessage && (
          <Toast
            type="error"
            message={errorMessage}
            dismissError={dismissError}
          />
        )}
      </div>
      <div className="px-6 py-4 bg-gray-50">
        <button
          onClick={onBookingConfirm}
          className="w-full bg-brand-secondary text-white py-2 rounded hover:bg-yellow-600 transition duration-300"
        >
          Book now
        </button>
        <div className="mt-4">
          <div className="font-semibold text-gray-800">Best Choice - Low Price Guarantee</div>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingDetailsCard;
