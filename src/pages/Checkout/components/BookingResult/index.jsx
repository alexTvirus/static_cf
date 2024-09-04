import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { history } from '../../../../routes/helper/history';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const BookingResult = () => {
  const contentToPrint = useRef(null);
  const navigate = history.navigate
  const location = history.location

  const dispatch = useDispatch();
  const {booking} = useSelector(state=>{
    return state.room
  })

  const [bookingDetails, setBookingDetails] = useState(null);


  const handlePrint = useReactToPrint({
    documentTitle: 'Booking Confirmation',
    removeAfterPrint: true,
  });


  useEffect(() => {
    setBookingDetails(bookingDetails);
  }, [bookingDetails]);

  return (
    <div className="md:mx-auto max-w-[800px] mt-4">
      <div className="flex justify-between mx-2 rounded-md my-2">
        <Link
          to="/"
          className={`border p-2 min-w-[120px] text-center transition-all delay-100 hover:bg-brand hover:text-white`}
        >
          Back to home
        </Link>
        {/* <button
          onClick={() => {
            handlePrint(null, () => contentToPrint.current);
          }}
          className="border p-2 min-w-[120px] transition-all delay-75 hover:bg-gray-500 hover:text-white hover:animate-bounce"
        >
          Print
        </button> */}
      </div>
      <div
        ref={contentToPrint}
        className="flex mx-2  px-4 py-12 items-center justify-center flex-col border rounded-md"
      >
        <div className="flex items-center justify-center mb-2">
          <FontAwesomeIcon icon={faStar} className="text-brand text-xl" />
          <FontAwesomeIcon icon={faStar} className="text-brand text-3xl" />
          <FontAwesomeIcon icon={faStar} className="text-brand text-4xl" />
          <FontAwesomeIcon icon={faStar} className="text-brand text-3xl" />
          <FontAwesomeIcon icon={faStar} className="text-brand text-xl" />
        </div>
        <h1 className="text-gray-700 text-2xl font-bold">Booking Result</h1>
        <p className="text-gray-600 mt-2">
          Thank you for your booking! Your reservation has been confirmed.
        </p>
        <p className="text-gray-600">
          Please check your email for the booking details and instructions for
          your stay.
        </p>
        <div className="mt-4 flex justify-center flex-wrap items-center">
          {bookingDetails &&
            bookingDetails.map((detail, index) => (
              <div key={index} className="border-r-2 px-4">
                <p className="text-gray-600 text-sm">{detail.label}</p>
                <span className="text-gray-600 text-sm font-bold">
                  {detail.value}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default BookingResult;
