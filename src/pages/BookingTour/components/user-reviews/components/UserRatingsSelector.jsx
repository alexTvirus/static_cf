import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import {isObjectEmpty} from '../../../../../utils/helpers'
import {LOGIN_MESSAGES} from '../../../../../utils/constants'

const UserRatingsSelector = ({
  userRating,
  handleRating,
  userReview,
  handleReviewSubmit,
  handleUserReviewChange,
}) => {


  const isLogined = ()=>{
    	  return localStorage.getItem("access_token") || false
  }

  return isLogined() ? (
    <div
      className={` w-full pl-0 md:pl-4 flex flex-col items-center justify-center`}
    >
      <div className="text-lg font-semibold text-gray-700">Đánh giá của bạn</div>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={star <= userRating ? fasStar : farStar}
            className={`cursor-pointer mx-1 text-2xl ${star <= userRating ? 'text-yellow-400' : 'text-gray-400'
              }`}
            onClick={() => handleRating(star)}
          />
        ))}
      </div>
      <textarea
        rows={3}
        className="w-full p-2 my-2 border"
        value={userReview}
        onChange={(e) => handleUserReviewChange(e.target.value)}
      />
      <button
        className="w-full px-4 py-2 my-2 font-bold text-white rounded bg-brand hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        onClick={handleReviewSubmit}
      >
        Đăng
      </button>
    </div>
  ) : (
    <p className="font-semibold text-gray-700">
      {LOGIN_MESSAGES.LOGIN_REQUIRE}
    </p>
  );
};

export default UserRatingsSelector;
