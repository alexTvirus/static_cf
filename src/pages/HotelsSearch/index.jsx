import React, { useState, useEffect, useCallback } from 'react';

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


import HotelBookingApi from '../../api/HotelBookingApi'


import { useDispatch, useSelector } from 'react-redux';
import { actionClearBooking, actionGetAllPackets, actionGetAllRoom, actionSetDateRange } from '../../redux/features/room/roomSlice';

import moment from 'moment';
import { DatePicker, Pagination, Radio, message } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';


const HotelsSearch = () => {
  const navigate = history.navigate
  const location = history.location
  const [searchParams, setSearchParams] = useSearchParams()
  const params = history.getSearchParams(searchParams)

  const dispath = useDispatch()
  const { rooms, isLoading, pagination, dateRange } = useSelector(state => {
    return state.room
  })

  const [currentResultsPage, setCurrentResultsPage] = useState(1);

  // State for managing filters data
  const [filtersData, setFiltersData] = useState({
    isLoading: false,
    data: {
      "checkbox": [{
        filterId: "ratings",
        filters: [
          { id: 1, title: '1 Star', value: 1 },
          { id: 2, title: '2 Star', value: 2 },
          { id: 3, title: '3 Star', value: 3 },
          { id: 4, title: '4 Star', value: 4 },
          { id: 5, title: '5 Star', value: 5 }
        ],
        title: "Điểm đánh giá của khách"
      }, {
        filterId: "packets",
        filters: [
          { id: 1, title: 'Kỳ nghỉ Gia đình', value: '1' },
          { id: 2, title: 'Gói nghỉ dưỡng ẩm thực trọn niềm vui', value: '2' },
          { id: 3, title: 'Ưu Đãi Độc Quyền Cho Hành Khách Eva Air', value: '3' }
        ],
        title: "Gói ưu đãi"
      }],
      priceRange: {
        title: "Ngân sách của bạn (mỗi đêm)",
        min: PRICE.MIN.price,
        max: PRICE.MAX.price,
        defaultValue: [PRICE.MIN.price, PRICE.MAX.price]
      }

    },
    errors: [],
  });

  const [sortByFilterValue, setSortByFilterValue] = useState({
    value: '0',
    label: 'Sắp xếp theo',
  });


  const [selectedFiltersState, setSelectedFiltersState] = useState({});

  const [selectedPrice, setselectedPrice] = useState({
    min: PRICE.MIN.price,
    max: PRICE.MAX.price
  });

  const [filteredTypeheadResults, setFilteredTypeheadResults] = useState([]);

  const [datePickerStatus, setDatePickerStatus] = useState("")

  const sortingFilterOptions = [
    { value: '0', label: 'Sắp xếp theo' },
    { value: '1', label: SORTING_FILTER_LABELS.PRICE_LOW_TO_HIGH },
    { value: '2', label: SORTING_FILTER_LABELS.PRICE_HIGH_TO_LOW },
  ];


  const [executeDebouncer, setExecuteDebouncer] = useState(false);

  const handlePriceRangeUpdate = (params) => {
    setselectedPrice({
      min: params[0],
      max: params[1]
    })
  }


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

  const onSortingFilterChange = (selectedOption) => {
    setSortByFilterValue(selectedOption);
  };


  const onFiltersUpdate = (updatedFilter) => {
    setSelectedFiltersState(
      selectedFiltersState.map((filterGroup) => {
        if (filterGroup.filterId === updatedFilter.filterId) {
          return {
            ...filterGroup,
            filters: filterGroup.filters.map((filter) => {
              if (filter.id === updatedFilter.id) {
                return {
                  ...filter,
                  isSelected: !filter.isSelected,
                };
              }
              return filter;
            }),
          };
        }
        return filterGroup;
      })
    );
  };

  const onDateChangeHandler = (ranges) => {
    dispath(actionSetDateRange(ranges))
  };

  const onSearchButtonAction = () => {
    const checkInDate = dateRange[0] ? moment(dateRange[0]?.$d).format(dateFormat) ?? '' : '';
    const checkOutDate = dateRange[1] ? moment(dateRange[1]?.$d).format(dateFormat) ?? '' : '';
    if (!checkInDate || !checkOutDate) {
      setDatePickerStatus("error")
      message.error("Hãy chọn ngày checkin, checkout")
      return
    }
    debounceFn();
  };

  const handleSearch = (params = {}) => {
    const activeFilters = getActiveFilters();
    const checkInDate = dateRange[0] ? moment(dateRange[0]?.$d).format(dateFormat) ?? '' : '';
    const checkOutDate = dateRange[1] ? moment(dateRange[1]?.$d).format(dateFormat) ?? '' : '';
    let price = JSON.stringify(selectedPrice)

    let packets = JSON.stringify(activeFilters?.packets)
    let ratings = JSON.stringify(activeFilters?.ratings)

    dispath(actionGetAllRoom({
      params: {
        sortBy: sortByFilterValue.value,
        price: price,
        packets: packets,
        ratings: ratings,
        checkin_at: checkInDate,
        checkout_at: checkOutDate
      }
    }))
  }

  const getActiveFilters = () => {
    const filters = {};
    selectedFiltersState.forEach((category) => {
      const selectedValues = category.filters
        .filter((filter) => filter.isSelected)
        .map((filter) => filter.value);

      if (selectedValues.length > 0) {
        filters[category.filterId] = selectedValues;
      }
    });
    if (!isObjectEmpty(filters)) {
      return filters;
    }
    return null;
  };

  const onClearFiltersAction = () => {
    const hasActiveFilters = selectedFiltersState.some((filterGroup) =>
      filterGroup.filters.some((filter) => filter.isSelected)
    );

    setselectedPrice({
      min: PRICE.MIN.price,
      max: PRICE.MAX.price
    })

    if (hasActiveFilters) {
      setSelectedFiltersState(
        selectedFiltersState.map((filterGroup) => ({
          ...filterGroup,
          filters: filterGroup.filters.map((filter) => ({
            ...filter,
            isSelected: false,
          })),
        }))
      );
    }
  };


  const handlePageChange = (page) => {
    setCurrentResultsPage(page);
  };

  const handlePreviousPageChange = () => {
    setCurrentResultsPage((prev) => {
      if (prev <= 1) return prev;
      return prev - 1;
    });
  };

  const handleNextPageChange = () => {
    setCurrentResultsPage((prev) => {
      if (prev >= pagination.totalPages) return prev;
      return prev + 1;
    });
  };



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

  }, [selectedFiltersState, currentResultsPage, sortByFilterValue, selectedPrice]);


  useEffect(() => {
    const initData = async () => {
      try {
        const rsp = await HotelBookingApi.getPackets();
        let packets = rsp.data.data
        if (packets && packets.length > 0) {
          let newFiltersData = {
            ...filtersData,
            isLoading: isLoading
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
        message.error(error)
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
            locationTypeheadResults={filteredTypeheadResults}
            dateRange={dateRange}
            onDateChangeHandler={onDateChangeHandler}
            onSearchButtonAction={onSearchButtonAction}
          />
        </div>
        <div className="container mx-auto">
          <div className="my-4"></div>
          <div className="w-[180px]"></div>
          <ResultsContainer
            selectedPrice={selectedPrice}
            onPriceRangeUpdate={handlePriceRangeUpdate}
            onBookNowClick={handleBookNowClick}
            isLoading={isLoading}
            hotelsResults={rooms}
            enableFilters={true}
            filtersData={filtersData}
            onFiltersUpdate={onFiltersUpdate}
            onClearFiltersAction={onClearFiltersAction}
            selectedFiltersState={selectedFiltersState}
            sortByFilterValue={sortByFilterValue}
            onSortingFilterChange={onSortingFilterChange}
            sortingFilterOptions={sortingFilterOptions}
          />
           
        </div>

      </div>
    </>
  );
};

export default HotelsSearch;
