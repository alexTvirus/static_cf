import HotelBookingDetailsCard from '../HotelBookingDetailsCard/HotelBookingDetailsCard';

import React, { useEffect, useState } from 'react';
import ReactImageGallery from 'react-image-gallery';
import { isObjectEmpty } from '../../../../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheck } from '@fortawesome/free-solid-svg-icons';


import { formatPrice, formatPrice1 } from '../../../../utils/price-helpers';

import { Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { actionGetRating, actionSetBooking } from '../../../../redux/features/room/roomSlice';
import ModalReview from '../UserReviews/components/ModalReview'



const HotelViewCard = ({ booking, hotelDetails, rooms, checkInDate, checkOutDate }) => {
  const dispatch = useDispatch();
  const { ratings, ratingLoading } = useSelector(state => {
    return state.room
  })

  const [currentPacketIndex, setCurrentPacketIndex] = useState({});
  const [images, setImages] = useState([])

  const [reviewData, setReviewData] = useState({
    isLoading: true,
    data: [],
  });
  const [currentReviewsPage, setCurrentReviewPage] = useState(1);

  const [isOpenReviewModel, setIsOpenReviewModel] = useState(false)

  const handleOkModal = () => {
    setIsOpenReviewModel(false)
  }

  const [reviewSelected, setReviewSelected] = useState({})

  const showReviewModal = async (params) => {
    await dispatch(actionGetRating(params))
    setReviewSelected(params)
    setIsOpenReviewModel(true)
  }

  const handleCancelModal = () => {
    setIsOpenReviewModel(false)
  }

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

  const handleSelectPacket = () => {
    if (hotelDetails.packets[0].rooms_available.length >= rooms) {
      let newSet = { ...currentPacketIndex }
      newSet[`${hotelDetails.packets[0].id}`] = (newSet[`${hotelDetails.packets[0].id}`] || 0) + 1
      setCurrentPacketIndex(newSet)
      let newPacket = [...booking.packets]
      for (let i = 0; i < rooms; i++) {
        newPacket.push(hotelDetails.packets[0])
      }
      let newBooking = {
        ...booking,
        packets: newPacket
      }
      dispatch(actionSetBooking(newBooking))
    }
  }

  const handleSelectGuest = (guests) => {
    let newBooking = { ...booking }
    newBooking.guests = guests
    dispatch(actionSetBooking(newBooking))
  }

  useEffect(() => {
    if (ratings) {
      setReviewData({
        isLoading: ratingLoading,
        data: ratings?.data || [],
        totalReviews: ratings?.total || 0,
        avg: ratings?.avg || 0,
        canReview: ratings?.canReview,
        room_type_packet_id: ratings?.room_type_packet_id || 0,
      });

    }
  }, [ratings])

  useEffect(() => {
    setImages(hotelDetails?.room_type_images?.map((image) => ({
      thumbnailClass: 'h-[80px]',
      thumbnailLoading: 'lazy',
      thumbnail:image.url,
      renderItem: () => {
        return <div>
          <img
            referrerpolicy="no-referrer"
            src={image.url}
          />
        </div>
      },
      renderThumbInner: () => {
        return <div>
          <img
            referrerpolicy="no-referrer"
            src={image.url}
          />
        </div>
      },
    })))

    if (!isObjectEmpty(hotelDetails))
      handleSelectPacket()

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
              <p className="text-sm text-gray-600 mb-2">

                <i class="gdlr-icon-double-bed2 mr-2 text-[28px] align-bottom"></i>
                <span className="text-slate-600 font-bold text-sm mr-2">
                  {`Giường:`}
                </span>
                <span className='mr-2'>
                  {`${hotelDetails.max_occupancy}`}
                </span>

                <i class="gdlr-icon-shower-head mr-2 text-[28px] align-bottom"></i>
                <span className="text-slate-600 font-bold text-sm mr-2">
                  {`Phòng tắm:`}
                </span>
                <span className='mr-2'>
                  {`${hotelDetails.bathrooms}`}
                </span>
                <i class="gdlr-icon-resize mr-2 text-[28px] align-bottom"></i>
                <span className="text-slate-600 font-bold text-sm mr-2 ">
                  {`Diện tích:`}
                </span>
                <span>
                  {`${hotelDetails.room_size}m²`}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {!isObjectEmpty(hotelDetails) && hotelDetails.description}
              </p>
              <h3 className="font-semibold text-gray-700 mb-2">
                Tiện nghi
              </h3>
              <div className="text-sm text-gray-600 mb-4">
                {!isObjectEmpty(hotelDetails) && hotelDetails.amenities.map((item, index, { length }) => (
                  <>
                    <span key={index}>
                      {item.name}
                    </span>
                    {(index + 1 < length) && <span key={`${index}-${index}`}> , </span>}
                  </>
                ))}
              </div>
            </div>

            {!isObjectEmpty(hotelDetails) && hotelDetails.packets.map((packet, index, { length }) => {

              if (packet.rooms_available.length >= rooms) {
                return (<>
                  <div key={index} className={`
                  ${(index === 0) ? "border-y-2 " : "border-b-2"}
                  ${(!!currentPacketIndex[`${packet.id}`]) ? "border-x-2 border-t-2 border-brand" : " border-slate-400 "}
                  px-4 py-8  `}>
                    <div
                      className="flex flex-col md:flex-row gap-y-4 gap-x-2 w-full"
                    >
                      <div className="flex flex-col md:gap-y-2 justify-center flex-1">
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
                        <div>
                          <a className='
                          inline-block cursor-pointer  px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          text-white bg-brand'>Xem chi tiết</a>
                        </div>

                        <div>
                          <p
                            onClick={() => showReviewModal({ room: hotelDetails.id, packet: packet.id })}
                            className="inline-block cursor-pointer  px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Xem Review
                          </p>
                        </div>

                      </div>
                      <div className="flex flex-col gap-y-2 ml-0 md:ml-auto border-l-0 items-stretch pl-0 md:pl-4">
                        <div className="flex flex-col ml-0 md:ml-auto justify-center items-center">
                          <p className="text-sm font-semibold text-gray-600">
                            {formatPrice(parseFloat(hotelDetails.base_price) + parseFloat(packet.base_price))} VND
                          </p>
                          <p className="text-sm text-gray-600">
                            Giá phòng 1 đêm
                          </p>
                        </div>
                        <div className="flex flex-col ml-0 md:ml-auto justify-center items-center">
                          <p className="text-sm font-semibold text-gray-600">
                            Số phòng còn trống: {packet.rooms_available.length}
                          </p>
                        </div>

                      </div>


                    </div>


                  </div >

                </>)
              } else {
                return (<>
                  <div key={index} className={`
                  ${(index === 0) ? "border-y-2 " : "border-b-2"}
                  ${(!!currentPacketIndex[`${packet.id}`]) ? "border-x-2 border-t-2 border-brand" : " border-slate-400 "}
                  px-4 py-8  `}>
                    <div
                      className="flex flex-col md:flex-row gap-y-4 gap-x-2 w-full"
                    >
                      <div className="flex flex-col md:gap-y-2 justify-center flex-1">
                        <h2 className="text-md font-semibold text-gray-800 mb-2">
                          Hết phòng
                        </h2>
                      </div>

                    </div>
                  </div >

                </>)
              }


            })}
          </div>

        </div>
        <ModalReview
          reviewSelected={reviewSelected}
          reviewData={reviewData}
          handlePageChange={() => { }}
          handlePreviousPageChange={() => { }}
          handleNextPageChange={() => { }}
          onCancel={handleCancelModal}
          onOk={handleOkModal}
          titleTaskModal={"Review của người dùng "}
          isModalOpen={isOpenReviewModel}
        ></ModalReview>
        <div className='sticky top-0'>
          {
            !isObjectEmpty(hotelDetails) && !isObjectEmpty(booking) &&
            <HotelBookingDetailsCard
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              rooms={rooms}
              handleSelectGuest={handleSelectGuest}
              packets={booking.packets}
              hotelCode={hotelDetails.id} />
          }
        </div>


      </div >
    </>


  );
};

export default HotelViewCard;
