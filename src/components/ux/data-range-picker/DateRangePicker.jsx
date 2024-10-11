import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';



import { DatePicker, Radio } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';

const { RangePicker } = DatePicker;


const DateRangePicker = (props) => {
  const {
    isDisable,
    onDateChangeHandler,
    dateRange = [null,null],
    datePickerStatus
  } = props;

  return (
    <div className="relative flex" data-testid="date-range-picker">
      <div className="">
        <RangePicker
          status={datePickerStatus}
          allowEmpty={[false,false]}
          disabled={isDisable && [true,true]}
          placeholder={["check-in","check-out"]}
          className='custom-date '
          minDate={dayjs(new Date())}
          // defaultValue={[dayjs(),dayjs()]}
          value={dateRange}
          // panelRender={(menu) => (
          //   <div test-id="test" ref={wrapperRef}>
          //     {menu}
          //   </div>
          // )}
          onChange={onDateChangeHandler}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
