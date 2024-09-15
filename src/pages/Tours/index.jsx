import { useState, useEffect, useCallback } from 'react';
import ResultsContainer from './components/ResultsContainer'

import { history } from '../../routes/helper/history';

import { RouteName } from '../../routes/RouteName';

import { Pagination } from "antd";

import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';


import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { message } from 'antd';
import HotelBookingApi from '../../api/HotelBookingApi';
import Util from '../../utils/util';
import { useSearchParams } from 'react-router-dom';
import LoadMore from '../../components/ux/pagination-controller/LoadMore';


dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';

const Tours = () => {
  const navigate = history.navigate
  const location = history.location
  const [searchParams, setSearchParams] = useSearchParams()
  const params = history.getSearchParams(searchParams)

  const dispatch = useDispatch()



  const [isLoading, setIsLoading] = useState(true)

  
  const [rooms, setRooms] = useState([])

  const [roomsPagination, setRoomsPagination] = useState({
    default_page: 1,
    default_perPage: 1,
    current_page: 1,
    per_page: 4,
    total: 0,
  })
  const handleRoomPagination = async (page, pageSize) => {
    setIsLoading(true)
    let rsp = await HotelBookingApi.getTours({ params: { ...params, page: page, limit: (pageSize * 2) } });
    let data = rsp.data.data
    rsp = rsp.data
    if (data && data.length > 0) {
      setRooms(data)
      setRoomsPagination({ ...roomsPagination, total: rsp.total, current_page: page, per_page: (pageSize * 2) })
    }
    setIsLoading(false)
  }


  const handleBookNowClick = (params) => {
    const checkInDate = params.checkInDate
    const checkOutDate = params.checkOutDate
    const queryParams = {
      hotelCode: params.hotelCode,
      checkInDate,
      checkOutDate,
      rooms: params.rooms,
      guests: params.guests,
    };
    navigate(`${RouteName.BOOKING.path}/${params.hotelCode}/tour/${params.packetCode}?${queryString.stringify(queryParams)}`);
  
  }

  useEffect(() => {

    const initData = async () => {
      try {
        setIsLoading(true)
        let rsp = await HotelBookingApi.getTours({ params: { ...params, page: roomsPagination.current_page, limit: roomsPagination.per_page } });
        let data = rsp.data.data
        rsp = rsp.data
        if (data && data.length > 0) {
          setRooms(data)
          setRoomsPagination({ ...roomsPagination, total: rsp.total })
        }

      } catch (error) {
        message.error(error)
      }
      setIsLoading(false)

    }
    initData()

  }, []);


  return (
    <>
      <div className="container mx-auto">
        <div className="my-8">
          <h2 className="text-3xl font-medium text-slate-700 text-center my-2">
            CÁC TOUR
          </h2>
          <ResultsContainer
            onBookNowClick={handleBookNowClick}
            isLoading={isLoading}
            hotelsResults={rooms}
          />
           <LoadMore
            defaultPageSize={roomsPagination.default_perPage}
            onChange={(page, pageSize) => handleRoomPagination(page, pageSize)}
            pageSize={roomsPagination.per_page}
            pageSizeOptions={[5, 10]}
            defaultCurrent={roomsPagination.current_page}
            current={roomsPagination.current_page}
            total={roomsPagination.total || 0}
          ></LoadMore>
        </div>
      </div>
    </>
  );
};

export default Tours;
