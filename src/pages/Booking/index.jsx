import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HotelViewCard from './components/HotelViewCard/HotelViewCard';
import HotelDetailsViewCardSkeleton from './components/hotel-details-view-card-skeleton/HotelDetailsViewCardSkeleton';
import { isObjectEmpty } from '../../utils/helpers'
import OverlayComponent from '../../components/OverLay'

import { useDispatch, useSelector } from 'react-redux';
import { actionClearBooking, actionGetRoom, actionSetBooking } from '../../redux/features/room/roomSlice';

import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';

const Booking = () => {
  const { hotelId } = useParams();

  const dispath = useDispatch()
  const { currentRoom, isLoading: roomLoading, booking, dateRange } = useSelector(state => {
    return state.room
  })

  useEffect(() => {
    return () => {
      dispath(actionClearBooking())
    }
  }, [])

  useEffect(() => {
    const checkIn = dayjs(dateRange[0]?.$d).format(dateFormat) ?? dayjs().format(dateFormat)
    const checkOut = dayjs(dateRange[1]?.$d).format(dateFormat) ?? dayjs().format(dateFormat)
    let newbooking = { ...booking, "room": { id: hotelId } }
    dispath(actionSetBooking(newbooking))
    dispath(actionGetRoom({
      "checkin_at": checkIn,
      "checkout_at": checkOut,
      id: hotelId
    }))
  }, [hotelId]);

  return (
    <>
      {(roomLoading || isObjectEmpty(currentRoom)) ? (
        <HotelDetailsViewCardSkeleton />
      ) : (
        <HotelViewCard booking={booking} hotelDetails={currentRoom} />
      )}
    </>
  );
};

export default Booking;
