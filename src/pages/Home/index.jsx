import HeroCover from './components/hero-cover/HeroCover';
import { useState, useEffect, useCallback } from 'react';
import ResultsContainer from '../../components/ResultsContainer';
import { formatDate } from '../../utils/date-helpers';
import { history } from '../../routes/helper/history';
import _debounce from 'lodash/debounce';
import { RouteName } from '../../routes/RouteName';

import { useDispatch, useSelector } from 'react-redux';
import { actionClearBooking, actionGetAllRoom, actionSetDateRange  } from '../../redux/features/room/roomSlice';


import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';

const Home = () => {
  const navigate = history.navigate
  const location = history.location
  
  const dispath = useDispatch()
  const { rooms, isLoading,dateRange } = useSelector(state => {
    return state.room
  })


  const onDateChangeHandler = (ranges) => {
    dispath(actionSetDateRange(ranges))
  };

  const onSearchButtonAction = () => {
    const checkInDate = moment(dateRange[0].$d).format(dateFormat) ?? '';
    const checkOutDate = moment(dateRange[1].$d).format(dateFormat) ?? '';
    navigate(RouteName.HOTELS.path, {
      state: {
        checkInDate,
        checkOutDate,
      },
    });
  };

  useEffect(() => {
    const getInitialData = async () => {
      dispath(actionGetAllRoom())
    };
    getInitialData();
  }, []);

  return (
    <>
      <HeroCover
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
            isLoading={isLoading}
            hotelsResults={rooms}
            enableFilters={false}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
