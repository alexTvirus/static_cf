import HeroCover from './components/hero-cover/HeroCover';
import { useState, useEffect, useCallback } from 'react';
import ResultsContainer from '../../components/ResultsContainer';

import { history } from '../../routes/helper/history';

import { RouteName } from '../../routes/RouteName';

import OverlayComponent from '../../components/OverLay'

import { useDispatch, useSelector } from 'react-redux';
import { actionGetAllRoom, actionSetDateRange } from '../../redux/features/room/roomSlice';


import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Test from './components/Test';
import PacketReview from './components/Test/PacketReview';
import Tour from './components/Test/Tour';
import { message } from 'antd';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';

const Home = () => {
  const navigate = history.navigate
  const location = history.location

  const dispath = useDispatch()
  const { rooms, isLoading, dateRange } = useSelector(state => {
    return state.room
  })

  const [datePickerStatus, setDatePickerStatus] = useState("")

  const onDateChangeHandler = (ranges) => {
    dispath(actionSetDateRange(ranges))
  };

  const onSearchButtonAction = () => {
    const checkInDate = dateRange[0] ? moment(dateRange[0].$d).format(dateFormat) ?? '' : '';
    const checkOutDate = dateRange[1] ? moment(dateRange[1].$d).format(dateFormat) ?? '' : '';
    if (!checkInDate || !checkOutDate) {
      setDatePickerStatus("error")
      message.error("Hãy chọn ngày checkin, checkout")
      return
    }
    navigate(RouteName.HOTELS.path, {
      state: {
        checkInDate,
        checkOutDate,
      },
    });
  };

  const handleBookNowClick = (hotelCode)=>{
    const checkInDate = dateRange[0] ? moment(dateRange[0].$d).format(dateFormat) ?? '' : '';
    const checkOutDate = dateRange[1] ? moment(dateRange[1].$d).format(dateFormat) ?? '' : '';
    if (!checkInDate || !checkOutDate) {
      setDatePickerStatus("error")
      message.error("Hãy chọn ngày checkin, checkout")
      return
    }
    navigate(`${RouteName.BOOKING.path}/${hotelCode}`);
  }

  useEffect(() => {
    const getInitialData = async () => {
      dispath(actionGetAllRoom())
    };
    getInitialData();
  }, []);

  return (
    <>
      {/* <OverlayComponent
        isLoading={isLoading}
      ></OverlayComponent> */}

      <HeroCover
        datePickerStatus={datePickerStatus}
        dateRange={dateRange}
        onDateChangeHandler={onDateChangeHandler}
        onSearchButtonAction={onSearchButtonAction}
      />
      <div className="container mx-auto">
        <div className="my-8">
          <h2 className="text-3xl font-medium text-slate-700 text-center my-2">
            CÁC LOẠI PHÒNG
          </h2>
          <ResultsContainer
            onBookNowClick={handleBookNowClick}
            isLoading={isLoading}
            hotelsResults={rooms}
            enableFilters={false}
          />
        </div>
        <div className='my-8'>
          {!isLoading && <Test></Test>}

        </div>
        <div className='my-8'>
          {!isLoading && <PacketReview></PacketReview>}
        </div>
        <div className='my-8'>
          {!isLoading && <Tour></Tour>}
        </div>
      </div>
    </>
  );
};

export default Home;
