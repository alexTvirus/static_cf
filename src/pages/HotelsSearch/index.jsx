import React, { useState, useEffect, useCallback, useRef } from 'react';

import ResultsContainer from '../../components/ResultsContainer';
import { isObjectEmpty } from '../../utils/helpers';

import { useSearchParams } from 'react-router-dom';
import { history } from '../../routes/helper/history';
import PaginationController from '../../components/ux/pagination-controller/PaginationController';
import { SORTING_FILTER_LABELS } from '../../utils/constants';
import _debounce from 'lodash/debounce';
import GlobalSearchBox from '../../components/GlobalSearchBox';
import { RouteName } from '../../routes/RouteName'
import { PRICE } from '../../utils/constants';
import VerticalFilters from '../../components/VerticalFilters';
import VerticalFiltersSkeleton from '../../components/VerticalFiltersSkeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';
import LoadMore from '../../components/ux/pagination-controller/LoadMore';

import { faFilter } from '@fortawesome/free-solid-svg-icons';

import HotelBookingApi from '../../api/HotelBookingApi'


import { useDispatch, useSelector } from 'react-redux';
import { actionClearBooking, actionGetAllPackets, actionGetAllRoom, actionSetDateRange } from '../../redux/features/room/roomSlice';

import moment from 'moment';
import { DatePicker, Pagination, Radio, message } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import useFilter from './hooks/useFilter';
import usePagination from './hooks/usePagination';
import { actionGetUserProfile, actionUpdateWishList } from '../../redux/features/auth/authSlice';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';


const HotelsSearch = () => {
  const navigate = history.navigate
  const location = history.location
  const [searchParams, setSearchParams] = useSearchParams()
  const params = history.getSearchParams(searchParams)

  const dispatch = useDispatch()
  const { dateRange } = useSelector(state => {
    return state.room
  })
  const { currentUser } = useSelector(state => {
    return state.auth
  })

  const [isLoading, setIsLoading] = useState(true);

  const [rooms, setRooms] = useState(true);

  const [datePickerStatus, setDatePickerStatus] = useState("")


  const [executeDebouncer, setExecuteDebouncer] = useState(false);

  const handleBookNowClick = (hotelCode) => {
    const checkInDate = dateRange[0] ? dayjs(dateRange[0]?.$d).format(dateFormat) ?? '' : '';
    const checkOutDate = dateRange[1] ? dayjs(dateRange[1]?.$d).format(dateFormat) ?? '' : '';
    if (!checkInDate || !checkOutDate) {
      setDatePickerStatus("error")
      message.error("Hãy chọn ngày checkin, checkout")
      return
    }
    navigate(`${RouteName.BOOKING.path}/${hotelCode}`);
  }

  const handleGetUserProfile = (options) => {
    dispatch(actionUpdateWishList(options.room_types))
  }

  const onDateChangeHandler = (ranges) => {
    dispatch(actionSetDateRange(ranges))
  };

  const onSearchButtonAction = () => {
    const checkInDate = dateRange[0] ? dayjs(dateRange[0]?.$d).format(dateFormat) ?? '' : '';
    const checkOutDate = dateRange[1] ? dayjs(dateRange[1]?.$d).format(dateFormat) ?? '' : '';
    if (!checkInDate || !checkOutDate) {
      setDatePickerStatus("error")
      message.error("Hãy chọn ngày checkin, checkout")
      return
    }
    debounceFn();
  };

  const handleSearch = (params = {}) => {
    const init = async () => {
      const activeFilters = getActiveFilters();
      const checkInDate = dateRange[0] ? dayjs(dateRange[0]?.$d).format(dateFormat) ?? '' : '';
      const checkOutDate = dateRange[1] ? dayjs(dateRange[1]?.$d).format(dateFormat) ?? '' : '';
      let price = JSON.stringify(selectedPrice)

      let packets = JSON.stringify(activeFilters?.packets)
      let ratings = JSON.stringify(activeFilters?.ratings)



      let param = {
        ...requestParams?.params,
        sortBy: sortByFilterValue.value,
        price: price,
        packets: packets,
        ratings: ratings,
        checkin_at: checkInDate,
        checkout_at: checkOutDate
      }
      param = { ...requestParams, params: param }
      setRequestParams(param)
      fetchData(param)
    }
    init()


  }



  // -----

  const fetchData = async (options) => {
    setIsLoading(true)
    try {
      let param = { ...options?.params }
      param = { ...options, params: param }
      let rsp = await HotelBookingApi.getAllRoom(param)
      const data = rsp.data.data
      rsp = rsp.data

      setPagination({ ...pagination, total: rsp.total, current_page: rsp.current_page, per_page: rsp.per_page })
      setRooms(data)
    } catch (error) {
      message.error("lỗi call api")
    }

    setIsLoading(false)
  }
  // ---- log pagination

  const { pagination, setPagination, requestParams, setRequestParams, handlePagination }
    = usePagination({ fetchData })

  // ---


  //---- logic filter
  const { sortingFilterOptions,
    filtersData, setFiltersData,
    sortByFilterValue,
    selectedFiltersState, setSelectedFiltersState,
    selectedPrice,
    getActiveFilters, onSortingFilterChange, filteredTypeheadResults,
    onFiltersUpdate, onClearFiltersAction, handlePriceRangeUpdate,
    isVerticalFiltersOpen, isSortingFilterVisible,
    toggleVerticalFiltersAction,
    buttonRef, wrapperRef } = useFilter({})
  //----


  //------ xu ly delay call api

  const debounceFn = useCallback(_debounce(() => setExecuteDebouncer(true), 600), []);

  useEffect(() => {
    if (executeDebouncer) {
      setExecuteDebouncer(false);
      handleSearch()
    }
  }, [executeDebouncer]);

  useEffect(() => {
    if (!isObjectEmpty(selectedFiltersState)) {
      debounceFn();
    }

  }, [selectedFiltersState, sortByFilterValue, selectedPrice]);

  // ----

  useEffect(() => {
    const initData = async () => {
      try {
        const rsp = await HotelBookingApi.getPackets();
        let packets = rsp.data.data
        if (packets && packets.length > 0) {
          let newFiltersData = {
            ...filtersData,
            isLoading: false
          }
          let packet = {
            filterId: "packets",
            filters: packets.map((packet) => {
              return { id: packet.id, title: packet.name_packet, value: packet.id }
            }),
            title: "Gói ưu đãi"
          }
          newFiltersData.data.checkbox[1] = packet

          let packetID = params?.packet
          setSelectedFiltersState(
            newFiltersData.data.checkbox.map((filterGroup) => {
              return {
                ...filterGroup,
                filters: filterGroup.filters.map((filter) => {
                  if (packet && filterGroup.filterId === "packets" && packetID == filter.id) {
                    return {
                      ...filter,
                      isSelected: true,
                    }
                  }

                  return {
                    ...filter,
                    isSelected: false,
                  }
                }),
              }
            })
          );
          setFiltersData(newFiltersData)
        }
      } catch (error) {
        message.error("lỗi call api")
      }

    }
    initData()
  }, []);

  return (
    <>
      <div className="hotels">
        <div className="bg-brand px-2 lg:h-[120px] h-[220px] flex items-center justify-center">
          <GlobalSearchBox
            datePickerStatus={datePickerStatus}
            dateRange={dateRange}
            onDateChangeHandler={onDateChangeHandler}
            onSearchButtonAction={onSearchButtonAction}
          />
        </div>
        <div className="container mx-auto">
          <div className="my-4"></div>
          <div className="w-[180px]"></div>
          <div className="relative">
            <div className="flex gap-x-0 md:gap-x-4 items-start mx-2">
              {!filtersData.isLoading && selectedFiltersState.length > 0 && (
                <div ref={wrapperRef}>
                  <VerticalFilters
                    isVerticalFiltersOpen={isVerticalFiltersOpen}
                    filtersData={selectedFiltersState}
                    priceRangeData={filtersData?.data?.priceRange}

                    selectedPrice={selectedPrice}
                    onPriceRangeUpdate={handlePriceRangeUpdate}
                    onBookNowClick={handleBookNowClick}
                    isLoading={isLoading}
                    hotelsResults={rooms}
                    enableFilters={true}

                    onFiltersUpdate={onFiltersUpdate}
                    onClearFiltersAction={onClearFiltersAction}
                    selectedFiltersState={selectedFiltersState}
                    sortByFilterValue={sortByFilterValue}
                    onSortingFilterChange={onSortingFilterChange}
                    sortingFilterOptions={sortingFilterOptions}
                  />
                </div>
              )}
              {filtersData.isLoading && <VerticalFiltersSkeleton />}
              <div className="flex flex-col w-full items-start">
                <div className="flex w-full justify-between px-2 md:px-0">
                  {!isLoading && (
                    <div className="vertical-filters__toggle-menu block md:hidden">
                      <button
                        ref={buttonRef}
                        data-testid="vertical-filters__toggle-menu"
                        onClick={toggleVerticalFiltersAction}
                        className="inline-flex items-center px-2.5 py-1.5 
                  border border-gray-300 font-medium rounded text-gray-700 bg-white 
                  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-indigo-500"
                      >
                        <FontAwesomeIcon icon={faFilter} size="sm" className="mr-1" />{' '}
                        Bộ lọc
                      </button>
                    </div>
                  )}
                  {isSortingFilterVisible && (
                    <Select
                      value={sortByFilterValue}
                      onChange={onSortingFilterChange}
                      options={sortingFilterOptions}
                      className="mb-2 w-[180px] text-sm"
                    />
                  )}
                </div>
                <ResultsContainer
                  onGetUserProfile={handleGetUserProfile}
                  currentUser={currentUser}
                  selectedPrice={selectedPrice}
                  onPriceRangeUpdate={handlePriceRangeUpdate}
                  onBookNowClick={handleBookNowClick}
                  isLoading={isLoading}
                  hotelsResults={rooms}
                />
                <LoadMore
                  defaultPageSize={pagination.default_perPage}
                  onChange={(page, pageSize) => handlePagination(page, pageSize)}
                  pageSize={pagination.per_page}
                  pageSizeOptions={[5, 10]}
                  defaultCurrent={pagination.current_page}
                  current={pagination.current_page}
                  total={pagination.total || 0}
                ></LoadMore>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HotelsSearch;
