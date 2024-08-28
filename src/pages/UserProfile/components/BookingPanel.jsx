import { formatDate1 } from '../../../utils/date-helpers'
import { formatPrice } from '../../../utils/price-helpers'
import { BOOKING_STATUS } from '../../../utils/constants'

import { Tag } from 'antd';

const BookingPanel = ({ bookings }) => {

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {bookings.map((booking, index) => (
          <li key={index} className="bg-white hover:bg-gray-50">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                {/* <p className="text-sm font-bold text-brand truncate">
                  {booking.hotelName}
                </p> */}
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Booking ID: {booking.id}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex gap-x-2">
                  <p className="flex items-center text-sm text-gray-500">
                    <svg
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-4 4V3m0 4v8m-4-4h8"
                      />
                    </svg>
                    Booking Date: {formatDate1(booking.created_at)}
                  </p>
                  <p className="flex items-center text-sm text-gray-500">
                    Check-in: {formatDate1(booking.checkin_at)}
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">

                    Check-out:{formatDate1(booking.checkout_at)}

                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">

                    Guests: {booking.number_guests}
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                    {
                      (()=>{
                        let rs = "";
                        switch(booking.status){
                          case BOOKING_STATUS.COMPLETE.id: rs =(<Tag color="success">{BOOKING_STATUS.COMPLETE.name}</Tag>); break;
                          case BOOKING_STATUS.PARTIALLY_PAID.id: rs= (<Tag color="warning">{BOOKING_STATUS.PARTIALLY_PAID.name}</Tag>); break;
                          case BOOKING_STATUS.CANCEL.id: rs= (<Tag color="error">{BOOKING_STATUS.CANCEL.name}</Tag>); break;
                          case BOOKING_STATUS.PENDING.id: rs= (<Tag color="processing">{BOOKING_STATUS.PENDING.name}</Tag>); break;
                        }
                        return rs;
                      })()
                    }
                    
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p className="flex items-center">
                    <span className="font-medium">Total price: </span>{' '}
                    <span className="ml-2">{formatPrice(booking.total_price)}</span>
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingPanel;
