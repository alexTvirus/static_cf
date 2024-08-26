import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HotelDetailsViewCard from './components/hotel-details-view-card/HotelDetailsViewCard';
import HotelDetailsViewCardSkeleton from './components/hotel-details-view-card-skeleton/HotelDetailsViewCardSkeleton';

import { useDispatch, useSelector } from 'react-redux';
import { actionGetRoom } from '../../redux/features/room/roomSlice';


const HotelDetails = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const dispath = useDispatch()
  const { currentRoom, isLoading } = useSelector(state => {
    return state.room
  })

  useEffect(() => {
    dispath(actionGetRoom({
      id: hotelId
    }))
  }, [hotelId]);

  return (
    <>
      {isLoading ? (
        <HotelDetailsViewCardSkeleton />
      ) : (
        <HotelDetailsViewCard hotelDetails={currentRoom} />
      )}
    </>
  );
};

export default HotelDetails;
