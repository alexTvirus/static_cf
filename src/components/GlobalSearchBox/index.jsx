
import DateRangePicker from '../../components/ux/data-range-picker/DateRangePicker';


const GlobalSearchBox = (props) => {
  const {
    onSearchButtonAction,
  } = props;
  
  const nextProps = {...props}
  
  return (
    <div className="flex flex-wrap flex-col lg:flex-row hero-content__search-box">
      <DateRangePicker
        {...nextProps}
      />
      <button
        className="w-full md:w-auto sb__button--secondary bg-brand-secondary hover:bg-yellow-600 px-4 py-2 text-white"
        onClick={onSearchButtonAction}
      >
        TÌM
      </button>
    </div>
  );
};

export default GlobalSearchBox;
