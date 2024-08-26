import HeroCover from './components/hero-cover/HeroCover';
import PopularLocations from './components/popular-locations/popular-locations';
import { useState, useEffect, useCallback } from 'react';
import { MAX_GUESTS_INPUT_VALUE } from '../../utils/constants';
import ResultsContainer from '../../components/ResultsContainer';
import { formatDate } from '../../utils/date-helpers';
import { useNavigate } from 'react-router-dom';
import _debounce from 'lodash/debounce';

import { useDispatch, useSelector } from 'react-redux';
import { actionGetAllRoom, actionSetDateRange  } from '../../redux/features/room/roomSlice';

import moment from 'moment';
import { DatePicker, Radio } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';



/**
 * Home component that renders the main page of the application.
 * It includes a navigation bar, hero cover, popular locations, results container, and footer.
 */
const Home = () => {
  const navigate = useNavigate();

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
    navigate('/hotels', {
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
            Handpicked nearby hotels for you
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
