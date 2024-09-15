import HotelViewCard from '../HotelViewCard';
import HotelViewCardSkeleton from '../HotelViewCardSkeleton'
import EmptyHotelsState from '../EmptyHotelsState';
import { useRef, useState } from 'react';
import useOutsideClickHandler from '../../../../hooks/useOutsideClickHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import { Slider } from 'antd';

const ResultsContainer = (props) => {
  const {
    isLoading,
    hotelsResults,
    onBookNowClick,
  } = props;

  const nextProps = { ...props}

  return (
    <div className="relative">
      
      <div className="flex gap-x-0 md:gap-x-4 items-start mx-2">
        <div className="flex flex-col w-full items-start">
          <div className="hotels-results__container mx-2 md:mx-0 flex flex-col gap-y-2 w-full">
            {isLoading ? (
              Array.from({ length: 5 }, (_, index) => (
                <HotelViewCardSkeleton key={index} />
              ))
            ) : hotelsResults.length > 0 ? (
              hotelsResults.map((hotel) => (
                <HotelViewCard
                  onBookNowClick={onBookNowClick}
                  key={hotel.id}
                  id={hotel.id}
                  room_type_id={hotel.room_type_id}
                  title={hotel.name_packet}
                  image={hotel?.packet_images[0]}
                  subtitle={hotel.description}
                  maxOccupancy={hotel.number_room}
                  tour_start_at = {hotel.tour_start_at}
                  tour_end_at = {hotel.tour_end_at}
                  rooms = {hotel.number_room}
                  guests = {hotel.number_guest}
                  benefits={hotel.benefits}
                  rating={hotel.rating}
                  price={hotel.base_price}
                />
              ))
            ) : (
              <EmptyHotelsState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsContainer;
