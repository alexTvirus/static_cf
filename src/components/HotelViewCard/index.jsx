import { faStar, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/price-helpers';
import { RouteName } from '../../routes/RouteName';

import { history } from '../../routes/helper/history';

const HotelViewCard = (props) => {
  const {
    id: hotelCode,
    image,
    title,
    maxOccupancy,
    roomSize,
    bathrooms,
    subtitle,
    benefits,
    price,
    ratings,
  } = props;
  const navigate = history.navigate
  const onBookNowClick = () => {
    navigate(`${RouteName.BOOKING.path}/${hotelCode}`);
  };

  return (
    <div
      className="card border p-4 flex flex-col md:flex-row gap-x-2 gap-y-4 w-full"
      data-testid="hotel-view-card"
    >
      <div className="cursor-pointer">
        <Link
          to={`${RouteName.BOOKING.path}/${hotelCode}`}
          className="block text-slate-700 hover:text-brand transition-colors duration-300"
        >
          <img
            src={image.url}
            alt={image.name}
            className="md:w-[220px] md:h-[140px]"
          />
        </Link>
      </div>
      <div className="flex flex-col justify-between ml-0 md:ml-2 flex-1">
        <div>
          <Link
            to={`${RouteName.BOOKING.path}/${hotelCode}`}
            className="block text-slate-700 hover:text-brand transition-colors duration-300"
          >
            <h4 className="text-2xl font-bold text-slate-600">{title}</h4>
          </Link>
          <p className="text-slate-600 text-sm mb-2">{subtitle}</p>
          <p className="text-sm text-gray-600">
            <span className="text-slate-600 font-bold text-sm">
              Giường
            </span>
            <span >
              {`: ${maxOccupancy}, `}
            </span>
            <span className="text-slate-600 font-bold text-sm">
              Phòng tắm
            </span>
            <span>
              {`: ${bathrooms}, `} ,
            </span>
            <span className="text-slate-600 font-bold text-sm">
              Diện tích
            </span>
            <span>
              {`: ${roomSize}m²`}
            </span>
          </p>
        </div>
        <ul>
          {benefits && benefits.length > 0 &&
            benefits.map((benefit, index) => (
              <li className="text-green-800 font-medium text-sm" key={index}>
                <FontAwesomeIcon icon={faCheck} /> {benefit}
              </li>
            ))}
        </ul>
      </div>
      <div className="flex flex-col ml-0 md:ml-auto justify-between border-l-0 md:border-l-2 items-stretch pl-0 md:pl-4">
        <div className="flex justify-between my-3 md:my-0 items-center md:flex-col md:justify-between w-full h-full">
          {ratings && <h4 className="font-medium text-sm text-white bg-brand p-2">
            {ratings && ratings.length > 0 && ratings}
            {ratings && ratings.length > 0 && <FontAwesomeIcon icon={faStar} />}
          </h4>}


          <div className="text-slate-600 font-bold whitespace-nowrap">
            <p>Giá 1 đêm</p> 
            {price && price.length > 0 && formatPrice(price)}
          </div>
        </div>
        <button
          className=" bg-brand-secondary px-4 py-2 text-white whitespace-nowrap"
          onClick={onBookNowClick}
        >
          Đặt ngay
        </button>
      </div>
    </div>
  );
};

export default HotelViewCard;
