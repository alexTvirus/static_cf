import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import HotelDetailsViewCard from './components/hotel-details-view-card/HotelDetailsViewCard';
import HotelDetailsViewCardSkeleton from './components/hotel-details-view-card-skeleton/HotelDetailsViewCardSkeleton';
import { isObjectEmpty } from '../../utils/helpers'
import OverlayComponent from '../../components/OverLay'

import { useDispatch, useSelector } from 'react-redux';
import { actionClearBooking, actionGetRoom, actionGetTour, actionSetBooking } from '../../redux/features/room/roomSlice';

import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';

const BookingTour = () => {
  const { hotelId, packetId } = useParams();
  const [searchParams] = useSearchParams();

  const dispath = useDispatch()
  const { currentRoom, isLoading: roomLoading, booking, dateRange } = useSelector(state => {
    return state.room
  })

  useEffect(() => {
    return () => {
      dispath(actionClearBooking())
    }
  }, [])

  const checkInDate = `${searchParams.get('checkInDate')} `
  const checkOutDate = `${searchParams.get('checkOutDate')}`
  const numberGuests = `${searchParams.get('guests')}`
  const rooms = `${searchParams.get('rooms')}`

  useEffect(() => {
    let newbooking = { ...booking, "room": { id: hotelId } }
    dispath(actionSetBooking(newbooking))
    dispath(actionGetTour({
      "checkin_at": checkInDate,
      "checkout_at": checkOutDate,
      id: hotelId,
      "packet_id": packetId
    }))
  }, [hotelId]);

  return (
    <>
      {(roomLoading || isObjectEmpty(currentRoom)) ? (
        <HotelDetailsViewCardSkeleton />
      ) : (
        <HotelDetailsViewCard 
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        numberGuests={numberGuests}
        rooms={rooms}
        booking={booking} hotelDetails={currentRoom} />
      )}
    </>
  );
};

export default BookingTour;
