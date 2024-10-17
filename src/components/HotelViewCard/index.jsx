import { faStar, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/price-helpers';
import { RouteName } from '../../routes/RouteName';
import { isObjectEmpty } from '../../utils/helpers';
import { history } from '../../routes/helper/history';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionGetUserProfile } from '../../redux/features/auth/authSlice';
import HotelBookingApi from '../../api/HotelBookingApi';
import { message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const HotelViewCard = (props) => {
  const {
    onGetUserProfile: handleGetUserProfile,
    hasWish,
    currentUser,
    id: hotelCode,
    image,
    title,
    maxOccupancy,
    roomSize,
    bathrooms,
    subtitle,
    benefits,
    price,
    rating,
    onBookNowClick
  } = props;
  const navigate = history.navigate

  const [love, setLove] = useState(false)

  const [loading, setLoading] = useState(false)

  const fetchData = async (options) => {
    setLoading(true)
    try {
      let param = { ...options?.params }
      param = { ...options, params: param }
      let rsp = await HotelBookingApi.updateWishlist(options.id, param)
      const data = rsp.data.data
      rsp = rsp.data
    } catch (error) {
      message.error("lỗi call api")
    }
    setLoading(false)
  }

  useEffect(() => {
    setLove(hasWish)
  }, [hasWish]);

  const handleWishlist = (options) => {
    setLove(!love)
    fetchData({ id: currentUser.id, "room_types": options })
    handleGetUserProfile({"room_types": options})
  }


  return (
    <div
      className="card border p-4 flex flex-col md:flex-row gap-x-2 gap-y-4 w-full"
      data-testid="hotel-view-card"
    >
      <div className="relative cursor-pointer">
        <div
          onClick={() => onBookNowClick(hotelCode)}
          className="block text-slate-700"
        >
          <img
            referrerpolicy="no-referrer"
            src={image?.url}
            alt={image?.name}
            className="md:w-[220px] md:h-[140px]"
          />
        </div>
        {
          !isObjectEmpty(currentUser) &&
          <>
            <div className='absolute   top-1 right-1  w-[36px] h-[36px] '>

              <div className='tooltip w-[100%] h-[100%]'>
                <span className="tooltiptext p-1">Yêu thích</span>
                <button onClick={() => handleWishlist(hotelCode)} className='w-[100%] h-[100%] rounded-full bg-white hover:bg-slate-200  transition-colors duration-300'>

                  <div className="w-[100%] h-[100%] relative" aria-hidden="true">
                    {loading ?

                      <><Spin
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        size="small" /></> :

                      <>
                        <img
                          referrerpolicy="no-referrer"
                          src={love ? "http://localhost/upload/heart.png" : "http://localhost/upload/heart1.png"}
                          className="block w-[70%] h-[70%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        />
                      </>

                    }

                  </div>

                </button>
              </div>

            </div>
          </>
        }


      </div>
      <div className="flex flex-col justify-between ml-0 md:ml-2 flex-1">
        <div>
          <div
            onClick={() => onBookNowClick(hotelCode)}
            className="cursor-pointer block text-slate-700 "
          >
            <h4 className="hover:text-slate-950 transition-colors duration-100 text-2xl font-bold text-brand">{title}</h4>
          </div>
          <p className="text-slate-600 text-sm mb-2">{subtitle}</p>
          <p className="text-sm text-gray-600">

            <i className="gdlr-icon-double-bed2 mr-2 text-[28px] align-bottom"></i>
            <span className="text-slate-600 font-bold text-sm mr-2">
              {`Giường:`}
            </span>
            <span className='mr-2'>
              {`${maxOccupancy}`}
            </span>

            <i className="gdlr-icon-shower-head mr-2 text-[28px] align-bottom"></i>
            <span className="text-slate-600 font-bold text-sm mr-2">
              {`Phòng tắm:`}
            </span>
            <span className='mr-2'>
              {`${bathrooms}`}
            </span>
            <i className="gdlr-icon-resize mr-2 text-[28px] align-bottom"></i>
            <span className="text-slate-600 font-bold text-sm mr-2 ">
              {`Diện tích:`}
            </span>
            <span>
              {`${roomSize}m²`}
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
          {!!rating && <h4 className="font-medium text-sm text-white bg-brand p-2">
            {!!rating && rating}
            {!!rating && <FontAwesomeIcon icon={faStar} />}
          </h4>}


          <div className="text-slate-600 font-bold whitespace-nowrap">
            <p>Giá 1 đêm</p>
            {price && price.length > 0 && formatPrice(price)}
          </div>
        </div>
        <button
          className=" bg-brand-secondary px-4 py-2 text-white whitespace-nowrap"
          onClick={() => onBookNowClick(hotelCode)}
        >
          Đặt ngay
        </button>
      </div>
    </div>
  );
};

export default HotelViewCard;
