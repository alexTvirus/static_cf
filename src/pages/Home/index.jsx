import HeroCover from './components/hero-cover/HeroCover';
import { useState, useEffect, useCallback } from 'react';
import ResultsContainer from '../../components/ResultsContainer';

import './gdlr-custom-icon.scss'

import { history } from '../../routes/helper/history';

import { RouteName } from '../../routes/RouteName';

import { Pagination } from "antd";

import { useDispatch, useSelector } from 'react-redux';
import { actionGetAllRoom, actionSetDateRange, actionSetPagination } from '../../redux/features/room/roomSlice';
import queryString from 'query-string';


import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Amenities from './components/List/Amenities';
import PacketReview from './components/List/PacketReview';
import Tour from './components/List/Tour';
import { message } from 'antd';
import HotelBookingApi from '../../api/HotelBookingApi';
import Util from '../../utils/util';
import { useSearchParams } from 'react-router-dom';
import LoadMore from '../../components/ux/pagination-controller/LoadMore';
import PacketCardSkeleton from '../../components/PacketCardSkeleton';
import { actionGetUserProfile } from '../../redux/features/auth/authSlice';
import usePacketPagination from './hooks/usePacketPagination';
import useTourPagination from './hooks/useTourPagination';
import useRoomPagination from './hooks/useRoomPagination';


dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';

const Home = () => {
  const navigate = history.navigate
  const location = history.location
  const [searchParams, setSearchParams] = useSearchParams()
  const params = history.getSearchParams(searchParams)

  const dispatch = useDispatch()
  const { dateRange, pagination } = useSelector(state => {
    return state.room
  })
  const { currentUser } = useSelector(state => {
    return state.auth
  })

  const [datePickerStatus, setDatePickerStatus] = useState("")

  const [amenitiesData, setAmenitiesData] = useState([])

  const [packetsData, setPacketsData] = useState([])

  const [toursData, setToursData] = useState([])

  const [rooms, setRooms] = useState([])




  // ----
  const {
    packetsPagination, setPacketsPagination,
    isPacketLoading, setIsPacketLoading,
    handlePacketPagination
  } = usePacketPagination({ setPacketsData,params })
  // ---

  // ----
  const {
    toursPagination, setToursPagination,
    isTourLoading, setIsTourLoading,
    handleTourPagination
  } = useTourPagination({ setToursData,params })
  // ---
  const {
    roomsPagination, setRoomsPagination,
    isLoading, setIsLoading,
    handleRoomPagination
  } = useRoomPagination({ setRooms,params })
  // ---



  const onDateChangeHandler = (ranges) => {
    dispatch(actionSetDateRange(ranges))
  };

  const onSearchButtonAction = () => {
    const checkInDate = dateRange[0] ? moment(dateRange[0]?.$d).format(dateFormat) ?? '' : '';
    const checkOutDate = dateRange[1] ? moment(dateRange[1]?.$d).format(dateFormat) ?? '' : '';
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

  const handleBookNowClick = (hotelCode) => {
    const checkInDate = dateRange[0] ? moment(dateRange[0]?.$d).format(dateFormat) ?? '' : '';
    const checkOutDate = dateRange[1] ? moment(dateRange[1]?.$d).format(dateFormat) ?? '' : '';
    if (!checkInDate || !checkOutDate) {
      setDatePickerStatus("error")
      message.error("Hãy chọn ngày checkin, checkout")
      return
    }
    navigate(`${RouteName.BOOKING.path}/${hotelCode}`);
  }

  const handleGetUserProfile = () => {
    dispatch(actionGetUserProfile())
  }

  const handleBookTour = (params) => {
    const checkInDate = params.checkInDate
    const checkOutDate = params.checkOutDate
    const queryParams = {
      hotelCode: params.hotelCode,
      checkInDate,
      checkOutDate,
      rooms: params.number_room,
      guests: params.number_room,
    };
    navigate(`${RouteName.BOOKING.path}/${params.hotelCode}/tour/${params.packetCode}?${queryString.stringify(queryParams)}`);
  }

  const handleSearchPacket = (id) => {
    let queryParams = {
      packet: id
    }
    const url = `${RouteName.HOTELS.path}?${queryString.stringify(queryParams)}`;
    navigate(url);
  }


  useEffect(() => {

    const initData = async () => {
      try {
        setIsLoading(true)
        let rsp = await HotelBookingApi.getAllRoom({ params: { ...params, page: roomsPagination.current_page, limit: roomsPagination.per_page } });
        let data = rsp.data.data
        rsp = rsp.data
        if (data && data.length > 0) {
          setRooms(data)
          setRoomsPagination({ ...roomsPagination, total: rsp.total })
        }


        rsp = await HotelBookingApi.getAmenities();
        data = rsp.data.data
        if (data && data.length > 0) {
          setAmenitiesData(data)
        }

        setIsPacketLoading(true)
        rsp = await HotelBookingApi.getPackets({ params: { ...params, page: packetsPagination.current_page, limit: packetsPagination.per_page } });
        data = rsp.data.data
        rsp = rsp.data
        if (data && data.length > 0) {
          setPacketsData(data)
          setPacketsPagination({ ...packetsPagination, total: rsp.total })
        }


        setIsTourLoading(true)
        rsp = await HotelBookingApi.getTours({ params: { ...params, page: toursPagination.current_page, limit: toursPagination.per_page } });
        data = rsp.data.data
        rsp = rsp.data
        if (data && data.length > 0) {
          setToursData(data)
          setToursPagination({ ...toursPagination, total: rsp.total })
        }

      } catch (error) {
        message.error("loi api")
      }
      setIsLoading(false)
      setIsTourLoading(false)
      setIsPacketLoading(false)

    }
    initData()

  }, []);

  useEffect(() => {
    dispatch(actionSetPagination({ current_page: pagination.default_perPage, per_page: pagination.per_page }))
  }, [searchParams])

  return (
    <>
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
            onGetUserProfile={handleGetUserProfile}
            currentUser={currentUser}
            onBookNowClick={handleBookNowClick}
            isLoading={isLoading}
            hotelsResults={rooms}
            enableFilters={false}
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
        <div className='my-8'>
          {(amenitiesData && amenitiesData?.length > 0) &&
            <Amenities
              isLoading={isLoading}
              amenitiesData={amenitiesData}
            ></Amenities>}

        </div>
        <div className='my-8'>
          {
            isPacketLoading ? (Array.from((() => {
              return { length: (packetsData?.length) ?? 1 }
            })(), (_, index) => (
              <PacketCardSkeleton key={index} />
            ))) :
              (
                (packetsData && packetsData.length > 0) && <PacketReview
                  onSearchPacket={handleSearchPacket}
                  packetsData={packetsData}
                ></PacketReview>
              )
          }

          <LoadMore
            defaultPageSize={packetsPagination.default_perPage}
            onChange={(page, pageSize) => handlePacketPagination(page, pageSize)}
            pageSize={packetsPagination.per_page}
            pageSizeOptions={[5, 10]}
            defaultCurrent={packetsPagination.current_page}
            current={packetsPagination.current_page}
            total={packetsPagination.total || 0}
          ></LoadMore>
        </div>
        <div className='my-8'>
          {
            isTourLoading ? (Array.from((() => {
              return { length: (toursData?.length) ?? 1 }
            })(), (_, index) => (
              <PacketCardSkeleton key={index} />
            ))) :
              (
                (toursData && toursData.length > 0) &&
                <Tour
                  onBookTour={handleBookTour}
                  toursData={toursData}
                ></Tour>
              )
          }
          <LoadMore
            defaultPageSize={toursPagination.default_perPage}
            onChange={(page, pageSize) => handleTourPagination(page, pageSize)}
            pageSize={toursPagination.per_page}
            pageSizeOptions={[5, 10]}
            defaultCurrent={toursPagination.current_page}
            current={toursPagination.current_page}
            total={toursPagination.total || 0}
          ></LoadMore>
        </div>
      </div>
    </>
  );
};

export default Home;
