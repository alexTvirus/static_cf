import { faLocationDot, faPerson } from '@fortawesome/free-solid-svg-icons';
import DateRangePicker from '../../components/ux/data-range-picker/DateRangePicker';
import Input from '../../components/ux/input/Input';


const GlobalSearchBox = (props) => {
  const {
    onDatePickerIconClick,
    locationTypeheadResults,
    onSearchButtonAction,
    onDateChangeHandler,
    dateRange,
  } = props;
  return (
    <div className="flex flex-wrap flex-col lg:flex-row hero-content__search-box">
      <DateRangePicker
        onDateChangeHandler={onDateChangeHandler}
        dateRange={dateRange}
      />
      <button
        className="w-full md:w-auto sb__button--secondary bg-brand-secondary hover:bg-yellow-600 px-4 py-2 text-white"
        onClick={onSearchButtonAction}
      >
        SEARCH
      </button>
    </div>
  );
};

export default GlobalSearchBox;
