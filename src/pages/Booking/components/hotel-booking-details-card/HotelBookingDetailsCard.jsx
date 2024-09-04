import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { differenceInCalendarDays } from 'date-fns';
import DateRangePicker from '../../../../components/ux/data-range-picker/DateRangePicker';
import { DEFAULT_TAX_DETAILS } from '../../../../utils/constants';
import { history } from '../../../../routes/helper/history';
import queryString from 'query-string';
import { formatPrice } from '../../../../utils/price-helpers';
import Toast from '../../../../components/ux/toast/Toast';
import { Divider, message } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';


import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { actionSetDateRange, actionSetTempBooking } from '../../../../redux/features/room/roomSlice';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';


const HotelBookingDetailsCard = (props) => {

  const { hotelCode, handleDeletePacket, packets, handleSelectGuest } = props
  const navigate = history.navigate
  const dispath = useDispatch()
  const { dateRange, currentRoom ,booking} = useSelector(state => {
    return state.room
  })

  const [selectedGuests, setSelectedGuests] = useState({
    value: 1,
    label: '1 guests',
  });
  const [selectedRooms, setSelectedRooms] = useState({
    value: 1,
    label: '1 room',
  });

  const [guestOptions, setGuestOptions] = useState(Array.from(
    { length: currentRoom.max_occupancy||4 },
    (_, i) => ({ value: i + 1, label: `${i + 1} guest` })
  ));


  const [total, setTotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [bookingPeriodDays, setBookingPeriodDays] = useState(1);


  const calGuestOptions = (packetNumber) => {
    setGuestOptions(Array.from(
      { length: (currentRoom.max_occupancy||4) * packetNumber },
      (_, i) => ({ value: i + 1, label: `${i + 1} guest` })
    ))
  }

  const calDate = (startDate, endDate) => {
    const days =
      startDate && endDate
        ? endDate.diff(startDate, 'day')
        : 1
    setBookingPeriodDays(days || 1);
  }


  const handleSelectGuestOption = (selectedOption) => {
    setSelectedGuests(selectedOption);
    handleSelectGuest(selectedOption.value)
  }

  const calculatePrices = () => {
    const pricePerNight = parseFloat(currentRoom.base_price)
    let pricePacket = 0
    packets.forEach(element => {
      pricePacket += (parseFloat(element.base_price) + pricePerNight) * bookingPeriodDays
    });


    // const gstRate =
    //   pricePerNight <= 2500 ? 0.12 : pricePerNight > 7500 ? 0.18 : 0.12;
    const gstRate = 0.12;
    const totalGst = (pricePacket * gstRate).toFixed(2);
    const totalPrice = (
      parseFloat(totalGst) + pricePacket
    ).toFixed(2);
    if (!isNaN(totalPrice)) {
      setTotal(totalPrice);
    }
    setTaxes(`${formatPrice(totalGst)} VND`);
  };

  const onBookingConfirm = () => {
    if (!dateRange || dateRange.length != 2 || !dateRange[0].$d || !dateRange[1].$d) {
      message.error('Please select check-in and check-out dates.')
      return;
    }
    const checkIn = moment(dateRange[0].$d).format(dateFormat) ?? '';
    const checkOut = moment(dateRange[1].$d).format(dateFormat) ?? '';
    const queryParams = {
      hotelCode,
      checkIn,
      checkOut,
      rooms: packets.length,
      guests: selectedGuests.value,
      hotelName: currentRoom?.name?.replaceAll(' ', '-'),
    };
    dispath(actionSetTempBooking(booking))
    const url = `/checkout?${queryString.stringify(queryParams)}`;
    navigate(url, {
      state: {
        total
      },
    });
  };

  useEffect(() => {
    setSelectedRooms({
      value: packets.length || 1,
      label: `${packets.length || 1} room`,
    })
    calGuestOptions(packets.length)
  }, [packets]);

  useEffect(() => {
    calculatePrices()
  }, [bookingPeriodDays, packets]);

  useEffect(() => {
    calDate(dateRange[0], dateRange[1])
  }, []);

  return (
    <div className="mx-2 bg-white shadow-xl rounded-xl overflow-auto mt-2 md:mt-0 w-full md:w-[380px]">
      <div className="px-6 py-4 bg-brand text-white">
        <h2 className="text-xl font-bold">Booking Details</h2>
      </div>
      <div className="p-6 text-sm md:text-base  overflow-auto max-h-screen">
        {/* Total Price */}
        <div className="mb-4">
          <div className="text-lg font-semibold text-gray-800 mb-1">
            Total Price
          </div>
          <div className="text-xl font-bold text-indigo-600">{total}</div>
          <div className="text-sm text-green-600">
          </div>
        </div>
        <Divider></Divider>
        {/* Dates & Time */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Dates & Time</div>
          <div className="text-gray-600">
            <DateRangePicker
              isDisable={true}
              dateRange={dateRange}
            />
          </div>
        </div>
        <Divider></Divider>
        {/* Reservation */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Reservation</div>
          <Select
            isDisabled={true}
            value={selectedRooms}
            className="mb-2"
          />

          <Select
            options={guestOptions}
            onChange={handleSelectGuestOption}
            value={selectedGuests}
          />
        </div>

        {/* Room Packet */}
        <div className="mb-4">
          {packets.length > 0 && packets.map((packet, index, { length }) => (
            <>
              <Divider></Divider>
              <div key={index} className="px-4 py-0">
                <div
                  className="flex flex-col md:flex-row gap-y-4 gap-x-2 w-full"
                >
                  <div className="flex flex-col justify-center flex-1">
                    <h2 className="text-md font-semibold text-gray-800 mb-2">
                      {packet.name_packet}
                    </h2>

                    <div >
                      <ul>
                        {packet.benefits.length > 0 &&
                          packet.benefits.map((benefit, index) => (
                            <li className="text-green-800 font-medium text-sm" key={index}>
                              <FontAwesomeIcon icon={faCheck} /> {benefit.name}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 ml-0 md:ml-auto border-l-0 items-stretch pl-0 md:pl-4">
                    <button
                      onClick={() => handleDeletePacket(index)}
                    >
                      <FontAwesomeIcon icon={faTrash} />

                    </button>
                  </div>
                </div>

              </div>
              {
                (index + 1 == length) &&
                <Divider></Divider>
              }
            </>

          ))}

        </div>

        {/* Taxes */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Taxes</div>
          <div className="text-gray-600">{taxes}</div>
          {/* <div className="text-xs text-gray-500">{DEFAULT_TAX_DETAILS}</div> */}
        </div>

      </div>
      <div className="px-6 py-4 bg-gray-50">
        <button
          disabled={packets.length < 1}
          onClick={onBookingConfirm}
          className=
          {(packets.length < 1 ? "bg-slate-700 cursor-not-allowed " : "bg-brand-secondary hover:bg-yellow-600 transition duration-300 ")
            + " transition duration-300 text-white py-2 rounded w-full"}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default HotelBookingDetailsCard;
