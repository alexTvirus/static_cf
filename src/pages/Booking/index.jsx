import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HotelDetailsViewCard from './components/hotel-details-view-card/HotelDetailsViewCard';
import HotelDetailsViewCardSkeleton from './components/hotel-details-view-card-skeleton/HotelDetailsViewCardSkeleton';

import { useDispatch, useSelector } from 'react-redux';
import { actionGetRoom, actionSetBooking } from '../../redux/features/room/roomSlice';


const Booking = () => {
  const { hotelId } = useParams();

  const dispath = useDispatch()
  const { currentRoom, isLoading, booking } = useSelector(state => {
    return state.room
  })

  useEffect(() => {
    let newbooking = {...booking}
    newbooking.room = {id: hotelId}
    dispath(actionSetBooking(newbooking))
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

export default Booking;
