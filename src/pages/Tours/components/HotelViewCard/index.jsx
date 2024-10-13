import { faStar, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../../../../utils/price-helpers';
import { RouteName } from '../../../../routes/RouteName';
import { formatDate1 } from '../../../../utils/date-helpers';

import { history } from '../../../../routes/helper/history';

const HotelViewCard = (props) => {
  const {
    rooms,
    guests,
    tour_end_at: checkOutDate,
    tour_start_at: checkInDate,
    id: packetCode,
    room_type_id: hotelCode,
    image,
    title,
    maxOccupancy,
    subtitle,
    benefits,
    price,
    onBookNowClick
  } = props;
  const navigate = history.navigate

  return (
    <div
      className="card border p-4 flex flex-col md:flex-row gap-x-2 gap-y-4 w-full"
      data-testid="hotel-view-card"
    >
      <div className="cursor-pointer transform transition duration-500 hover:scale-105">
        <div
          onClick={() => onBookNowClick(
            {
              hotelCode,
              packetCode,
              checkOutDate,
              checkInDate,
              rooms,
              guests
            })}
          className="block text-slate-700 hover:text-brand transition-colors duration-300"
        >
          <img
            src={image?.url}
            alt={image?.name}
            className="md:w-[220px] md:h-[140px]"
          />
        </div>
      </div>
      <div className="flex flex-col justify-between ml-0 md:ml-2 flex-1">
        <div>
          <div
            onClick={() => onBookNowClick(
              {
                hotelCode,
                packetCode,
                checkOutDate,
                checkInDate,
                rooms,
                guests
              })}
            className="cursor-pointer block text-slate-700 hover:text-brand transition-colors duration-300"
          >
            <h4 className="text-2xl font-bold text-slate-600">{title}</h4>
          </div>
          <p className="text-slate-600 text-sm mb-2">{subtitle}</p>
          <p className="text-sm text-gray-600 mb-2">

            <i className="gdlr-icon-double-bed2 mr-2 text-[28px] align-bottom"></i>
            <span className="text-slate-600 font-bold text-sm mr-2">
              {`Số phòng của tour:`}
            </span>
            <span className='mr-2'>
              {`${maxOccupancy}`}
            </span>
          </p>
          <div className="text-sm text-gray-600 mb-2">
            <div className='inline-block w-[28px] h-[28px] align-bottom mr-2'>
              <svg xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 512 411.74">
                <path  d="M342.41 411.74H35.42c-9.72 0-18.56-3.99-24.99-10.4C3.99 394.89 0 386.04 0 376.32V71.06c0-9.71 3.99-18.56 10.4-24.99 6.46-6.44 15.31-10.43 25.02-10.43h32.66v43.58c0 12.2 5.64 22.93 14.73 30.38l.05-.06c7.69 6.28 17.88 10.17 28.79 10.17 11.01 0 21.22-3.86 28.83-10.1v-.1c9.1-7.47 14.73-18.18 14.73-30.29V35.64h65.96v43.58c0 11 4.65 20.83 12.32 28.15l2.41 2.24c7.61 6.23 17.82 10.1 28.83 10.1 9.69 0 18.82-3.07 26.12-8.16l2.72-1.95c9.09-7.45 14.73-18.18 14.73-30.38V35.64h34.11c9.71 0 18.57 3.99 24.99 10.42 6.43 6.4 10.42 15.26 10.42 25v102c-3.77 3.37-7.56 6.79-11.35 10.23v-45.11H11.35v234.36c0 15.31 12.53 27.85 27.85 27.85h299.42c15.32 0 27.85-12.56 27.85-27.85v-38.7l11.35 10.19v32.29c0 9.75-3.99 18.61-10.4 25.02-6.44 6.41-15.3 10.4-25.01 10.4zm97.02-68.76c-1.48-14.86-2.7-32.58-3.6-46.68H512v-72.15h-77.72c.39-14.11 1.17-31.87 2.36-46.76.96-5.95-6.04-9.76-10.55-5.92l-91.24 83.3c-2.7 2.32-3.02 6.41-.7 9.11l.74.74 94.01 84.37c4.61 3.91 11.51-.2 10.53-6.01zM247.64 14.02c0-7.73 7.64-14.02 17.09-14.02 9.46 0 17.11 6.29 17.11 14.02v65.2c0 7.74-7.65 14.02-17.11 14.02-9.45 0-17.09-6.28-17.09-14.02v-65.2zm-153.1 0C94.54 6.29 102.2 0 111.65 0s17.1 6.29 17.1 14.02v65.2c0 7.74-7.65 14.02-17.1 14.02-9.45 0-17.11-6.28-17.11-14.02v-65.2zM63.75 287.07h50.75c3.55 0 6.46 2.93 6.46 6.47v42.21c0 3.54-2.93 6.47-6.46 6.47H63.75c-3.54 0-6.47-2.92-6.47-6.47v-42.21c0-3.56 2.92-6.47 6.47-6.47zm199.18-98.98h50.75c3.55 0 6.46 2.92 6.46 6.46v32.13l-6.83 6.57a36.773 36.773 0 0 0-7.32 9.98h-43.06c-3.54 0-6.47-2.91-6.47-6.47v-42.21c0-3.56 2.92-6.46 6.47-6.46zm0 98.98h50.75l.76.05.19.16 5.34 4.8c.11.47.17.95.17 1.46v42.21c0 3.54-2.93 6.47-6.46 6.47h-50.75c-3.54 0-6.47-2.92-6.47-6.47v-42.21c0-3.56 2.92-6.47 6.47-6.47zm-98.86-98.98h50.74c3.55 0 6.46 2.92 6.46 6.46v42.21c0 3.54-2.92 6.47-6.46 6.47h-50.74c-3.54 0-6.47-2.91-6.47-6.47v-42.21c0-3.56 2.91-6.46 6.47-6.46zm-100.32 0h50.75c3.55 0 6.46 2.92 6.46 6.46v42.21c0 3.54-2.93 6.47-6.46 6.47H63.75c-3.54 0-6.47-2.91-6.47-6.47v-42.21c0-3.56 2.92-6.46 6.47-6.46zm100.32 98.98h50.74c3.55 0 6.46 2.93 6.46 6.47v42.21c0 3.54-2.92 6.47-6.46 6.47h-50.74c-3.54 0-6.47-2.92-6.47-6.47v-42.21c0-3.56 2.91-6.47 6.47-6.47z" />
              </svg>

            </div>
            <span className="text-slate-600 font-bold text-sm mr-2">
              {`Ngày checkin:`}
            </span>
            <span className='mr-2'>
              {`${formatDate1(checkInDate)}`}
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            <div className='inline-block w-[28px] h-[28px] align-bottom mr-2'>
              <svg xmlns="http://www.w3.org/2000/svg" 
              
                viewBox="0 0 512 410.2">
                <path d="M35.28 35.51h32.54v43.42c0 10.58 4.27 20.06 11.35 27.23 17.03 17.14 45.5 17.45 63.06.93 7.71-7.29 12.4-17.14 12.4-28.16V35.51h65.71v43.42c0 6.34 1.56 12.3 4.35 17.6 2.03 3.85 4.71 7.37 7.92 10.43l2.41 2.24c1.79 1.46 3.71 2.79 5.76 3.97l.31.18.07.04.25.13.16.1.15.08.27.14.05.03.32.17.05.03.27.13.15.08.17.09.26.12.07.04.32.16.03.01.31.15.12.06.2.09.24.11.1.05.33.14.34.16.1.04.23.1.21.09.13.05.31.13h.03l.34.14.08.04.27.1.18.07.16.06.3.11.05.02.34.12.06.02.3.11.16.05.19.07.26.09.09.03.35.12.02.01.34.1.13.04.22.07.25.07.11.03.36.11.36.1.11.03.25.07.22.06.14.04.34.09h.02l.37.1.08.02.29.06.19.05.17.03.32.08.05.01.37.08.06.01.31.06.17.04.21.03.28.06.09.02.37.07h.03l.35.06.14.03.23.03.27.04.11.02.38.06.38.05.12.01.26.04.23.03.15.01.35.05h.03l.39.04.08.01.3.02.21.02.17.02.34.02.05.01.39.03h.05l.34.02.18.01.21.01.3.02h.08l.39.01.03.01.36.01h.39l.28.01h.96l.33-.01h.39l.18-.01.2-.01.25-.01h.13l.32-.02h.07l.38-.02h.01l.37-.02.07-.01.32-.02.12-.01.26-.02.19-.02.19-.02.25-.02.13-.01.31-.04h.07l.37-.05h.01l.37-.04.06-.01.32-.04.12-.02.26-.03.18-.03.19-.03.24-.04.14-.02.3-.05.07-.01.36-.06h.01l.37-.07.05-.01.32-.06.12-.02.25-.05.18-.04.19-.04.23-.05.14-.03.29-.07.08-.01.35-.08.01-.01.36-.08.05-.02.31-.08.11-.02.25-.07.17-.04.2-.06.22-.05.14-.05.28-.08.07-.02.34-.09.02-.01.36-.11.03-.01.32-.1.1-.03.25-.08.16-.05.19-.07.22-.07.13-.04.28-.1.08-.03.32-.11.02-.01.35-.13.04-.01.3-.11.09-.04.26-.1.15-.06.19-.07.21-.09.13-.05.26-.11.08-.03.32-.13.02-.01.33-.14.04-.02.3-.13.09-.04.24-.11.14-.07.19-.08.19-.1.14-.06.25-.12.08-.03.3-.16h.03l.32-.17.03-.01.29-.16.09-.04.24-.12.13-.07.19-.1.18-.1.14-.07.23-.13.08-.05.29-.16.03-.01.31-.18c1.11-.64 2.17-1.31 3.2-2.03l2.71-1.95c4.36-3.56 7.92-7.88 10.43-12.76 2.73-5.26 4.25-11.19 4.25-17.5V35.51h33.97c9.68 0 18.5 3.98 24.91 10.38 6.4 6.37 10.38 15.2 10.38 24.9V192.9H365.1v-53.83H11.3v233.49c0 15.25 12.49 27.74 27.75 27.74h298.3c15.27 0 27.75-12.51 27.75-27.74V325.6h11.31v49.32c0 9.7-3.98 18.53-10.37 24.91-6.42 6.39-15.24 10.37-24.92 10.37H35.28c-9.68 0-18.49-3.97-24.89-10.37C3.97 393.41 0 384.59 0 374.92V70.79C0 61.12 3.97 52.3 10.36 45.9c6.43-6.42 15.25-10.39 24.92-10.39zm211.43-21.54c0-7.71 7.61-13.97 17.03-13.97 9.42 0 17.04 6.26 17.04 13.97v64.96c0 7.7-7.62 13.96-17.04 13.96-9.42 0-17.03-6.26-17.03-13.96V13.97zm-152.52 0C94.19 6.26 101.81 0 111.23 0c9.42 0 17.03 6.26 17.03 13.97v64.96c0 7.7-7.61 13.96-17.03 13.96-9.42 0-17.04-6.26-17.04-13.96V13.97zm311.37 327.72c1.48-14.79 2.69-32.45 3.59-46.5h-75.88v-71.88h77.43c-.39-14.06-1.17-31.75-2.35-46.58-.96-5.93 6.02-9.73 10.51-5.9l90.89 82.99c2.7 2.31 3.02 6.38.7 9.08l-.74.73-93.65 84.05c-4.6 3.89-11.47-.19-10.5-5.99zM63.51 286h50.56c3.53 0 6.43 2.91 6.43 6.44v42.06c0 3.52-2.91 6.44-6.43 6.44H63.51c-3.53 0-6.44-2.91-6.44-6.44v-42.06c0-3.54 2.9-6.44 6.44-6.44zm198.44-98.62h50.55c3.23 0 5.92 2.43 6.37 5.52h-16v49.42h-40.92c-3.53 0-6.45-2.9-6.45-6.45v-42.05c0-3.54 2.9-6.44 6.45-6.44zm0 98.62h40.92v39.6h16.07v8.9c0 3.52-2.92 6.44-6.44 6.44h-50.55c-3.53 0-6.45-2.91-6.45-6.44v-42.06c0-3.54 2.9-6.44 6.45-6.44zm-98.5-98.62h50.56c3.53 0 6.43 2.92 6.43 6.44v42.05c0 3.53-2.91 6.45-6.43 6.45h-50.56c-3.53 0-6.44-2.9-6.44-6.45v-42.05c0-3.54 2.9-6.44 6.44-6.44zm-99.94 0h50.56c3.53 0 6.43 2.92 6.43 6.44v42.05c0 3.53-2.91 6.45-6.43 6.45H63.51c-3.53 0-6.44-2.9-6.44-6.45v-42.05c0-3.54 2.9-6.44 6.44-6.44zM163.45 286h50.56c3.53 0 6.43 2.91 6.43 6.44v42.06c0 3.52-2.91 6.44-6.43 6.44h-50.56c-3.53 0-6.44-2.91-6.44-6.44v-42.06c0-3.54 2.9-6.44 6.44-6.44z" />
              </svg>

            </div>
            <span className="text-slate-600 font-bold text-sm mr-2">
              {`Ngày checkout:`}
            </span>
            <span className='mr-2'>
              {`${formatDate1(checkOutDate)}`}
            </span>
          </div>

        </div>
        <ul>
          {benefits && benefits.length > 0 &&
            benefits.map((benefit, index) => (
              <li className="text-green-800 font-medium text-sm" key={index}>
                <FontAwesomeIcon icon={faCheck} /> {benefit.name}
              </li>
            ))}
        </ul>
      </div>
      <div className="flex flex-col ml-0 md:ml-auto justify-between border-l-0 md:border-l-2 items-stretch pl-0 md:pl-4">
        <div className="flex justify-between my-3 md:my-0 items-center md:flex-col md:justify-between w-full h-full">
          {/* <div className="text-slate-600 font-bold whitespace-nowrap">
            <p>Giá 1 đêm</p>
            {price && price.length > 0 && formatPrice(price)}
          </div> */}
        </div>
        <button
          className=" bg-brand-secondary px-4 py-2 text-white whitespace-nowrap"
          onClick={() => onBookNowClick(
            {
              hotelCode,
              packetCode,
              checkOutDate,
              checkInDate,
              rooms,
              guests
            })}
        >
          Đặt ngay
        </button>
      </div>
    </div>
  );
};

export default HotelViewCard;
