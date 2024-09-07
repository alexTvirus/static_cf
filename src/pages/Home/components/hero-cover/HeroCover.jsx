import { useState } from 'react';
import GlobalSearchBox from '../../../../components/GlobalSearchBox';

const HeroCover = (props) => {
  const {
    dateRange,
    onDateChangeHandler,
    onSearchButtonAction,
  } = props;

  const nextProps = {...props}

  return (
    <div className='bg-brand'>
      <div className='container mx-auto'>
        <div className="min-h-[400px] md:min-h-72 lg:min-h-60 text-slate-100">
          <div className="hero-content__container flex flex-col items-center container mx-auto px-2 md:px-0">
            <></>
            <div className="hero-content__text py-4">
              <h3 className="text-4xl font-medium">
                Discover your perfect stay around the globe
              </h3>
              <p className="my-1">
                Enter your dates to see the latest prices and begin your journey of
                relaxation and adventure today.
              </p>
            </div>
            <GlobalSearchBox
              {...nextProps}
            />
          </div>
        </div>
      </div>

    </div>

  );
};

export default HeroCover;
