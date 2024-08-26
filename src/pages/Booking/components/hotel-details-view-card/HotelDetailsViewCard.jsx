import HotelBookingDetailsCard from '../hotel-booking-details-card/HotelBookingDetailsCard';
import UserReviews from '../user-reviews/UserReviews';
import React, { useEffect, useState } from 'react';
import ReactImageGallery from 'react-image-gallery';
import { isObjectEmpty } from '../../../../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheck } from '@fortawesome/free-solid-svg-icons';

import { formatPrice, formatPrice1 } from '../../../../utils/price-helpers';

import { Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { actionSetBooking } from '../../../../redux/features/room/roomSlice';



const HotelDetailsViewCard = ({ hotelDetails }) => {
  const dispatch = useDispatch();
  const { booking } = useSelector(state => {
    return state.room
  })

  const [images, setImages] = useState([])

  const [reviewData, setReviewData] = useState({
    isLoading: true,
    data: [],
  });
  const [currentReviewsPage, setCurrentReviewPage] = useState(1);

  // const handlePageChange = (page) => {
  //   setCurrentReviewPage(page);
  // };

  // const handlePreviousPageChange = () => {
  //   setCurrentReviewPage((prev) => {
  //     if (prev <= 1) return prev;
  //     return prev - 1;
  //   });
  // };

  // const handleNextPageChange = () => {
  //   setCurrentReviewPage((prev) => {
  //     if (prev >= reviewData.pagination.totalPages) return prev;
  //     return prev + 1;
  //   });
  // };

  const handleSelectPacket = (packet) => {
    let newPacket = [...booking.packets]
    newPacket.push(packet)
    let newBooking = {
      ...booking,
      packets: newPacket
    }
    dispatch(actionSetBooking(newBooking))

  }

  const handleDeletePacket = (index) => {
    let newPacket = [...booking.packets]
    newPacket.splice(index, 1)
    let newBooking = {
      ...booking,
      packets: newPacket
    }
    dispatch(actionSetBooking(newBooking))
  }

  const handleSelectGuest = (guests) => {
    let newBooking = {...booking}
    newBooking.guests = guests
    dispatch(actionSetBooking(newBooking))
  }

  useEffect(() => {
    setReviewData({
      isLoading: true,
      data: [],
    });
    setImages(hotelDetails?.room_type_images?.map((image) => ({
      original: image.url,
      thumbnail: image.url,
      thumbnailClass: 'h-[80px]',
      thumbnailLoading: 'lazy',
    })))


    // const fetchHotelReviews = async () => {
    //   const response = await networkAdapter.get(
    //     `/api/hotel/${hotelDetails.hotelCode}/reviews`,
    //     {
    //       currentPage: currentReviewsPage,
    //     }
    //   );
    //   if (response && response.data) {
    //     setReviewData({
    //       isLoading: false,
    //       data: response.data.elements,
    //       metadata: response.metadata,
    //       pagination: response.paging,
    //     });
    //   }
    // };
    // fetchHotelReviews();
  }, [hotelDetails, currentReviewsPage]);



  return (
    <>
      <div className="flex items-start justify-center flex-wrap md:flex-nowrap container mx-auto p-4">
        <div className="w-[800px] bg-white shadow-lg rounded-lg overflow-hidden">
          <div>
            <div className="relative w-full">
              <ReactImageGallery
                items={images}
                showPlayButton={false}
                showFullscreenButton={false}
              />
            </div>
            <div className="p-4">
              <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                {!isObjectEmpty(hotelDetails) && hotelDetails.name}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                <span className="text-slate-600 font-bold text-sm">
                  Sleep
                </span>
                <span >
                  {`: ${hotelDetails.max_occupancy}, `}
                </span>
                <span className="text-slate-600 font-bold text-sm">
                  Bathrooms
                </span>
                <span>
                  {`: ${hotelDetails.bathrooms}, `}
                </span>
                <span className="text-slate-600 font-bold text-sm">
                  Size
                </span>
                <span>
                  {`: ${hotelDetails.room_size}m²`}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {!isObjectEmpty(hotelDetails) && hotelDetails.description}
              </p>
              <h3 className="font-semibold text-gray-700 mb-2">
                Amenities
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {!isObjectEmpty(hotelDetails) && hotelDetails.amenities.map((item, index, { length }) => (
                  <>
                    <span key={index}>
                      {item.name}
                    </span>
                    {(index + 1 < length) && <span> , </span>}
                  </>
                ))}
              </p>
            </div>

            {!isObjectEmpty(hotelDetails) && hotelDetails.packets.map((packet, index, { length }) => (
              <>
                <Divider></Divider>
                <div key={index} className="px-4 py-0">
                  <div
                    className="flex flex-col md:flex-row gap-y-4 gap-x-2 w-full"
                  >
                    <div className="flex flex-col justify-center flex-1">
                      <h2 className="text-md font-semibold text-gray-800 mb-2">
                        {packet.name_packet}
                      </h2>

                      <div >
                        <ul>
                          {packet.benefits.length > 0 &&
                            packet.benefits.map((benefit, index) => (
                              <li className="text-green-800 font-medium text-sm" key={index}>
                                <FontAwesomeIcon icon={faCheck} /> {benefit.name}
                              </li>
                            ))}
                        </ul>
                      </div>
                      <a className='cursor-pointer inline-block align-baseline font-medium text-md text-brand  hover:underline'>More info</a>
                    </div>
                    <div className="flex flex-col gap-y-2 ml-0 md:ml-auto border-l-0 items-stretch pl-0 md:pl-4">
                      <div className="flex flex-col ml-0 md:ml-auto justify-center items-center">
                        <p className="text-sm font-semibold text-gray-600">
                          {formatPrice(parseFloat(hotelDetails.base_price) + parseFloat(packet.base_price))} VND
                        </p>
                        <p className="text-sm text-gray-600">
                          Cost for 1 night, 2 guests
                        </p>
                      </div>
                      <button
                        onClick={() => handleSelectPacket(packet)}
                        className="hover:bg-yellow-600 transition duration-300 bg-brand-secondary px-4 py-2 text-white whitespace-nowrap"
                      >
                        Select
                      </button>
                    </div>
                  </div>

                </div>
                {
                  (index + 1 == length) &&
                  <div className='mb-5'></div>
                }
              </>

            ))}
          </div>
          {/* <UserReviews
          reviewData={reviewData}
          handlePageChange={handlePageChange}
          handlePreviousPageChange={handlePreviousPageChange}
          handleNextPageChange={handleNextPageChange}
        /> */}
        </div>
        <div className='sticky top-0'>
          {
            !isObjectEmpty(hotelDetails) &&
            <HotelBookingDetailsCard
              handleSelectGuest={handleSelectGuest}
              packets={booking.packets}
              handleDeletePacket={handleDeletePacket}
              hotelCode={hotelDetails.id} />
          }
        </div>


      </div>
    </>


  );
};

export default HotelDetailsViewCard;
