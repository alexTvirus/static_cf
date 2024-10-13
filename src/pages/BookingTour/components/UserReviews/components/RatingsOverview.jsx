import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import {RATING_MESSAGES} from '../../../../../utils/constants'

const RatingsOverview = ({ averageRating, ratingsCount, starCounts }) => {
  const calRatingCount = () =>{
    return `Dựa trên ${ratingsCount} lượt đánh giá`
  }
  return (
    <div className=" w-full md:w-3/5">
      <div className="text-lg font-semibold text-gray-700">{RATING_MESSAGES.OVERALL_RATING}</div>
      <div className="text-3xl font-bold text-gray-700">{averageRating}/5</div>
      <div className="text-sm">{calRatingCount()}</div>
      {/* {Object.keys(starCounts)
        .sort((a, b) => b - a)
        .map((starRating) => (
          <div className="flex items-center my-1 gap-x-4" key={starRating}>
            <div className="w-8 pr-2 flex items-center">
              {starRating}{' '}
              <FontAwesomeIcon
                icon={fasStar}
                className="text-yellow-400 ml-1"
              />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-300">
              <div
                className="bg-yellow-400 h-2.5 rounded-full"
                style={{
                  width: `${(starCounts[starRating] / ratingsCount) * 100}%`,
                }}
              ></div>
            </div>
            <span>{starCounts[starRating]}</span>
          </div>
        ))} */}
    </div>
  );
};

export default RatingsOverview;
