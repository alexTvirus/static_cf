import Checkbox from '../../components/ux/checkbox/Checkbox';
import PriceRange from '../../components/ux/PriceRange';
import { formatPrice1 } from '../../utils/price-helpers'

const VerticalFilters = (props) => {
  const {
    selectedPrice,
    priceRangeData,
    filtersData,
    onFiltersUpdate,
    onClearFiltersAction,
    isVerticalFiltersOpen,
  } = props;


  const nextProps = { ...props }


  const isActiveFilterSelected = () => {
    if (filtersData && filtersData?.length > 0) {
      for (const filterGroup of filtersData) {
        for (const subfilter of filterGroup.filters) {
          if (subfilter.isSelected) {
            return true;
          }
        }
      }
    }

    return false;
  };

  return (
    <div
      className={`hotels-filters__container shadow-lg border w-[240px] z-10 ${isVerticalFiltersOpen ? '' : 'hidden'
        } absolute top-10 left-2 bg-white md:block md:static md:shadow-none`}
      data-testid="vertical-filters"
    >
      <div className="hotels-filters__header flex justify-between items-center py-2 border-b  px-4">
        <h4 className="text-base font-[700] text-slate-600 ">
          Chọn lọc theo
        </h4>
        <button
          className={`text-sm inline-flex items-center px-2.5 py-1.5 border border-gray-300 font-medium rounded text-gray-700 bg-white 
          ${isActiveFilterSelected() === true
              ? 'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              : 'cursor-not-allowed'
            }`}
          onClick={onClearFiltersAction}
        >
          Xóa
        </button>
      </div>
      {filtersData.map((filter, index) => (
        <div className={`border-b md:px-2 md:py-3`}
          key={filter.filterId}
        >
          <h4 className="text-base font-[700] text-slate-600 my-1 px-2">
            {filter.title}
          </h4>
          {filter.filters.map((subfilter) => (
            <Checkbox
              key={subfilter.id}
              id={subfilter.id}
              label={subfilter.title}
              isSelected={subfilter.isSelected}
              filterId={filter.filterId}
              onFiltersUpdate={onFiltersUpdate}
            />
          ))}

        </div>
      ))}

      <div className={`px-2 md:py-3`}>
        <h4 className="text-base font-[700] text-slate-600 my-1 px-2">
          {priceRangeData.title}
        </h4>
        <div className='md:py-3'>
          <span htmlFor="default-checkbox" className="shrink  font-[400] text-sm ms-2 text-slate-600 ">
            {`${formatPrice1(selectedPrice.min)} - ${formatPrice1(selectedPrice.max)}`}
          </span>

        </div>

        <PriceRange
          {...nextProps}
        ></PriceRange>
      </div>


    </div>
  );
};

export default VerticalFilters;
