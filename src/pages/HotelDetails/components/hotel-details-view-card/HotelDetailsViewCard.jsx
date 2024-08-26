import HotelBookingDetailsCard from '../hotel-booking-details-card/HotelBookingDetailsCard';
import UserReviews from '../user-reviews/UserReviews';
import React, { useEffect, useState } from 'react';
import ReactImageGallery from 'react-image-gallery';
import { isObjectEmpty } from '../../../../utils/helpers'



const HotelDetailsViewCard = ({ hotelDetails }) => {
  const [images, setImages] = useState([])

  const [reviewData, setReviewData] = useState({
    isLoading: true,
    data: [],
  });
  const [currentReviewsPage, setCurrentReviewPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentReviewPage(page);
  };

  const handlePreviousPageChange = () => {
    setCurrentReviewPage((prev) => {
      if (prev <= 1) return prev;
      return prev - 1;
    });
  };

  const handleNextPageChange = () => {
    setCurrentReviewPage((prev) => {
      if (prev >= reviewData.pagination.totalPages) return prev;
      return prev + 1;
    });
  };


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
                {`: ${hotelDetails.bathrooms}, `} ,
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
              {!isObjectEmpty(hotelDetails) && hotelDetails.amenities.map((item, index) => (
                <span key={index}>
                  {item.name},
                </span>
              ))}
            </p>
          </div>
        </div>
        {/* <UserReviews
          reviewData={reviewData}
          handlePageChange={handlePageChange}
          handlePreviousPageChange={handlePreviousPageChange}
          handleNextPageChange={handleNextPageChange}
        /> */}
      </div>
      {
        !isObjectEmpty(hotelDetails) &&
        <HotelBookingDetailsCard hotelCode={hotelDetails.id} />
      }

    </div>
  );
};

export default HotelDetailsViewCard;
