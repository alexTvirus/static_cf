import React, { useState, useEffect, useCallback } from 'react';

import ResultsContainer from '../../components/ResultsContainer';
import { isObjectEmpty } from '../../utils/helpers';
import { MAX_GUESTS_INPUT_VALUE } from '../../utils/constants';
import { formatDate } from '../../utils/date-helpers';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { parse } from 'date-fns';
import PaginationController from '../../components/ux/pagination-controller/PaginationController';
import { SORTING_FILTER_LABELS } from '../../utils/constants';
import _debounce from 'lodash/debounce';
import GlobalSearchBox from '../../components/GlobalSearchBox';


import { useDispatch, useSelector } from 'react-redux';
import { actionGetAllRoom, actionSetDateRange } from '../../redux/features/room/roomSlice';

import moment from 'moment';
import { DatePicker, Radio } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';


const HotelsSearch = () => {
  const navigate = useNavigate();

  const dispath = useDispatch()
  const { rooms, isLoading, pagination, dateRange } = useSelector(state => {
    return state.room
  })

  const [availableCities, setAvailableCities] = useState([]);


  const [currentResultsPage, setCurrentResultsPage] = useState(1);

  // State for managing filters data
  const [filtersData, setFiltersData] = useState({
    isLoading: true,
    data: [],
    errors: [],
  });

  // State for storing hotels search results
  const [hotelsResults, setHotelsResults] = useState({
    isLoading: true,
    data: [],
    errors: [],
  });


  const [sortByFilterValue, setSortByFilterValue] = useState({
    value: 'default',
    label: 'Sort by',
  });


  const [selectedFiltersState, setSelectedFiltersState] = useState({});

  const [filteredTypeheadResults, setFilteredTypeheadResults] = useState([]);


  const debounceFn = useCallback(_debounce(queryResults, 1000), []);

  const [searchParams, setSearchParams] = useSearchParams();

  const location = useLocation();

  const sortingFilterOptions = [
    { value: 'default', label: 'Sort by' },
    { value: 'priceLowToHigh', label: SORTING_FILTER_LABELS.PRICE_LOW_TO_HIGH },
    { value: 'priceHighToLow', label: SORTING_FILTER_LABELS.PRICE_HIGH_TO_LOW },
  ];


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
    const activeFilters = getActiveFilters();
    const checkInDate = moment(dateRange[0].$d).format(dateFormat) ?? '';
    const checkOutDate = moment(dateRange[1].$d).format(dateFormat) ?? '';
    setSearchParams({
    });

    dispath(actionGetAllRoom({
      params: {
        ...activeFilters,
        checkin_at: checkInDate,
        checkout_at: checkOutDate
      }
    }))

  };

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

  // Toggles the visibility of the date picker
  const onDatePickerIconClick = () => {
  };

  /**
   * Queries the available cities based on the user's input.
   * @param {string} query - The user's input.
   * @returns {void}
   *
   */
  function queryResults(query, availableCities) {
    const filteredResults = availableCities
      .filter((city) => city.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
    setFilteredTypeheadResults(filteredResults);
  }


  const onClearFiltersAction = () => {
    const hasActiveFilters = selectedFiltersState.some((filterGroup) =>
      filterGroup.filters.some((filter) => filter.isSelected)
    );

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

  /**
   * Fetches hotels based on the provided filters.
   * @param {Object} filters - The filters to apply.
   * @returns {Promise<void>}
   * @async
   */
  const fetchHotels = async (filters) => {
  };

  const getVerticalFiltersData = async () => {
    const filtersDataResponse = 'api/hotels/verticalFilters'
    if (filtersDataResponse) {
      setFiltersData({
        isLoading: false,
        data: filtersDataResponse.data.elements,
        errors: filtersDataResponse.errors,
      });
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


  useEffect(() => {
  }, [searchParams]);

  useEffect(() => {
    setSelectedFiltersState(
      filtersData.data.map((filterGroup) => ({
        ...filterGroup,
        filters: filterGroup.filters.map((filter) => ({
          ...filter,
          isSelected: false,
        })),
      }))
    );
  }, [filtersData]);

  // useEffect(() => {
  //   if (selectedFiltersState.length > 0) {
  //     const activeFilters = getActiveFilters();
  //     if (activeFilters) {
  //       fetchHotels(activeFilters);
  //     } else {
  //       fetchHotels({
  //       });
  //     }
  //   }

  // }, [selectedFiltersState, currentResultsPage, sortByFilterValue]);


  useEffect(() => {
    if (location.state) {
      const { checkInDate, checkOutDate } = location.state;
      if (checkInDate && checkOutDate) {
        dispath(actionSetDateRange([dayjs(checkInDate, dateFormat),
          dayjs(checkOutDate, dateFormat)]))
      }
      
      dispath(actionGetAllRoom({
        params: {
          checkin_at: checkInDate,
          checkout_at: checkOutDate
        }
      }))
    }
  }, [location]);

  return (

    <div className="hotels">
      <div className="bg-brand px-2 lg:h-[120px] h-[220px] flex items-center justify-center">
        <GlobalSearchBox
          locationTypeheadResults={filteredTypeheadResults}
          dateRange={dateRange}
          onDateChangeHandler={onDateChangeHandler}
          onDatePickerIconClick={onDatePickerIconClick}
          onSearchButtonAction={onSearchButtonAction}
        />
      </div>
      <div className="container mx-auto">
        <div className="my-4"></div>
        <div className="w-[180px]"></div>
        <ResultsContainer
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
        {/* {pagination?.totalPages > 1 && (
          <div className="my-4">
            <PaginationController
              currentPage={pagination?.currentPage}
              totalPages={pagination?.totalPages}
              handlePageChange={handlePageChange}
              handlePreviousPageChange={handlePreviousPageChange}
              handleNextPageChange={handleNextPageChange}
            />
          </div>
        )} */}
      </div>

    </div>
  );
};

export default HotelsSearch;
