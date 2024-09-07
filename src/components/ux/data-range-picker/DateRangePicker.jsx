import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { DateRange } from 'react-date-range';
import { formatDate } from '../../../utils/date-helpers';
import useOutsideClickHandler from '../../../hooks/useOutsideClickHandler';

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
    dateRange = [dayjs(),dayjs()],
  } = props;

  return (
    <div className="relative flex" data-testid="date-range-picker">
      <div className="">
        <RangePicker
          allowEmpty={[false,false]}
          disabled={isDisable && [true,true]}
          placeholder={["check in","checkout"]}
          className='custom-date '
          minDate={dayjs(new Date())}
          defaultValue={[dayjs(),dayjs()]}
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
