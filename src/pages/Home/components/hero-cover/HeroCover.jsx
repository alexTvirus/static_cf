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
                KHÁM PHÁ KÌ NGHỈ CỦA BẠN CÙNG CHÚNG TÔI
              </h3>
              <p className="my-1 text-center">
                Nhập ngày để tìm phòng ưng ý và bắt đầu nghĩ dưỡng
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
