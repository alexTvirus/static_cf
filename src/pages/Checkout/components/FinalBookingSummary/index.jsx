import React from 'react';
import { differenceInCalendarDays } from 'date-fns';

import { formatPrice } from '../../../../utils/price-helpers';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Divider } from 'antd';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';




const FinalBookingSummary = ({
  numberGuests,
  numberRooms,
  hotelName,
  checkIn,
  checkOut,
  phone,
  email,
  fullName,
  total,
}) => {

  const calDate = (checkIn, checkOut) => {
    checkIn = dayjs(checkIn, dateFormat)
    checkOut = dayjs(checkOut, dateFormat)
    return checkOut.diff(checkIn, 'day') || 1
  }

  const numNights = calDate(checkIn, checkOut)
  return (
    <div className="bg-white border-gray-200 border rounded-lg p-6 mb-6 shadow w-full max-w-lg mx-auto mt-4">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-800">{hotelName}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-3">
          <div>
            <p className="text-sm font-semibold text-gray-600">Check-in</p>
            <p className="text-sm text-gray-800">{checkIn}</p>
          </div>
          <div>
            <p className="text-sm text-gray-800 inline-flex py-1 px-5 rounded-2xl border">
              {numNights}  Đêm
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Check-out</p>
            <p className="text-sm text-gray-800">{checkOut}</p>
          </div>
        </div>
        <Divider></Divider>
        <div className='flex flex-col items-start justify-start mt-2'>
          <p className="text-sm font-semibold text-gray-600">Khách</p>
          <p className="text-sm text-gray-800">{numberGuests}</p>
        </div>
        <div className='flex flex-col items-start justify-start mt-2'>
          <p className="text-sm font-semibold text-gray-600">Phòng</p>
          <p className="text-sm text-gray-800">{numberRooms}</p>
        </div>
        <Divider></Divider>
        <div className='flex flex-col items-start justify-start mt-2'>
          <p className="text-sm font-semibold text-gray-600">Tổng tiền</p>
          <p className="text-sm text-gray-800">{`${formatPrice(total)} VND`}</p>
        </div>
      </div>
    </div>
  );
};

export default FinalBookingSummary;
