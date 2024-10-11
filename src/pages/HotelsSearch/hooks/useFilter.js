import { useEffect, useRef, useState } from 'react';
import useOutsideClickHandler from '../../../hooks/useOutsideClickHandler';
import { isObjectEmpty } from '../../../utils/helpers';
import { PRICE } from '../../../utils/constants';
import { SORTING_FILTER_LABELS } from '../../../utils/constants';

const useFilter = (props) => {
    const {

    } = props

    const sortingFilterOptions = [
        { value: '0', label: 'Sắp xếp theo' },
        { value: '1', label: SORTING_FILTER_LABELS.PRICE_LOW_TO_HIGH },
        { value: '2', label: SORTING_FILTER_LABELS.PRICE_HIGH_TO_LOW },
    ];

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

    const onSortingFilterChange = (selectedOption) => {
        setSortByFilterValue(selectedOption);
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

    const handlePriceRangeUpdate = (params) => {
        setselectedPrice({
            min: params[0],
            max: params[1]
        })
    }

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

    const wrapperRef = useRef();
    const buttonRef = useRef();

    const [isVerticalFiltersOpen, setIsVerticalFiltersOpen] = useState(false);

    const toggleVerticalFiltersAction = () => {
        setIsVerticalFiltersOpen((prevState) => !prevState);
    };

    useOutsideClickHandler(wrapperRef, (event) => {
        if (!buttonRef?.current?.contains(event.target)) {
            setIsVerticalFiltersOpen(false);
        }
    });

    const isSortingFilterVisible =
        sortingFilterOptions && sortingFilterOptions.length > 0;


    return {
        sortingFilterOptions,
        filtersData, setFiltersData,
        sortByFilterValue, setSortByFilterValue,
        selectedFiltersState, setSelectedFiltersState,
        selectedPrice, setselectedPrice,
        getActiveFilters,onSortingFilterChange,filteredTypeheadResults,
        onFiltersUpdate,onClearFiltersAction,handlePriceRangeUpdate,
        isVerticalFiltersOpen, setIsVerticalFiltersOpen, isSortingFilterVisible,
        toggleVerticalFiltersAction, useOutsideClickHandler,
        buttonRef, wrapperRef
    }
};

export default useFilter;
