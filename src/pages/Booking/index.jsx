import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HotelDetailsViewCard from './components/hotel-details-view-card/HotelDetailsViewCard';
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
  const { currentRoom, isLoading, booking, dateRange } = useSelector(state => {
    return state.room
  })

  useEffect(() => {
    return () => {
      dispath(actionClearBooking())
    }
  }, [])

  useEffect(() => {
    const checkIn = moment(dateRange[0].$d).format(dateFormat) ?? '';
    const checkOut = moment(dateRange[1].$d).format(dateFormat) ?? '';
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
      {(isLoading || isObjectEmpty(currentRoom)) ? (
        <HotelDetailsViewCardSkeleton />
      ) : (
        <HotelDetailsViewCard hotelDetails={currentRoom} />
      )}
    </>
  );
};

export default Booking;
