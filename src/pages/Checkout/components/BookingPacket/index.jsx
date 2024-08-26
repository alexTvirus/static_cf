import React from 'react';
import { differenceInCalendarDays } from 'date-fns';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';



const FinalBookingSummary = ({
  packet,
  hotelName,
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
      </div>
    </div>
  );
};

export default FinalBookingSummary;
