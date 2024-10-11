import Review from './components/Review';
import React, { useState } from 'react';
import RatingsOverview from './components/RatingsOverview';
import UserRatingsSelector from './components/UserRatingsSelector';

import Toast from '../../../../components/ux/toast/Toast';
import PaginationController from '../../../../components/ux/pagination-controller/PaginationController';


import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { actionRating } from '../../../../redux/features/room/roomSlice';
dayjs.extend(customParseFormat);
const dateFormat = 'DD-MM-YYYY';

const UserReviews = ({
  reviewSelected,
  reviewData,
  handlePageChange,
  handlePreviousPageChange,
  handleNextPageChange,
}) => {
  const [userRating, setUserRating] = useState(0);

  const [userReview, setUserReview] = useState('');

  const [shouldHideUserRatingsSelector, setShouldHideUserRatingsSelector] =
    useState(false);

  const dispatch = useDispatch();

  const handleRating = (rate) => {
    setUserRating(rate);
  };



  const handleReviewSubmit = async () => {
    if (userRating === 0) {
      message.error('Please select a rating before submitting.')
      return;
    }
    await dispatch(actionRating({
      "packet_id": reviewSelected?.packet,
      "room_type_id": reviewSelected?.room,
      rate: userRating,
      comment: userReview,
    }))
    setShouldHideUserRatingsSelector(true);
  };

  const handleUserReviewChange = (review) => {
    setUserReview(review);
  };

  const isEmpty = reviewData.data.length === 0;


  return (
    <div className="flex flex-col p-4 border-t">
      <div className="flex flex-col  py-4 bg-white  gap-6">
        {reviewData.data.length === 0 ? (
          <div className="w-3/5">
            <span className="text-gray-500 italic">
              Chưa có lượt đánh giá nào!
            </span>
          </div>
        ) : (
          <RatingsOverview
            averageRating={reviewData.avg}
            ratingsCount={reviewData.totalReviews}
          // starCounts={reviewData.metadata.starCounts}
          />
        )}
        <div>
          {shouldHideUserRatingsSelector ? null : (
            <UserRatingsSelector
              reviewData={reviewData}
              userRating={userRating}
              isEmpty={isEmpty}
              handleRating={handleRating}
              userReview={userReview}
              handleReviewSubmit={handleReviewSubmit}
              handleUserReviewChange={handleUserReviewChange}
            />
          )}
        </div>
      </div>

      <div>
        {reviewData.isLoading ? (
          ""
        ) : (
          <div>
            {reviewData.data.map((review, index) => (
              <Review
                key={index}
                reviewerName={review?.customer?.email}
                reviewDate={dayjs(review.created_at, dateFormat).format(dateFormat)}
                review={review.comment}
                rating={review.rate}
                verified={review.verified}
              />
            ))}
          </div>
        )}
      </div>
      {/* {reviewData.data.length > 0 && (
        <PaginationController
          currentPage={reviewData.pagination.currentPage}
          totalPages={reviewData.pagination.totalPages}
          handlePageChange={handlePageChange}
          handlePreviousPageChange={handlePreviousPageChange}
          handleNextPageChange={handleNextPageChange}
        />
      )} */}
    </div>
  );
};

export default UserReviews;
