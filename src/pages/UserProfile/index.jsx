import React, { useState, useEffect, useRef } from 'react';
import Tabs from '../../components/ux/tabs/Tabs';
import TabPanel from '../../components/ux/tab-panel/TabPanel';
import {
  faAddressCard,
  faHotel,
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import useOutsideClickHandler from '../../hooks/useOutsideClickHandler';
import { history } from '../../routes/helper/history';
import BookingPanel from './components/BookingPanel';
import ProfileDetailsPanel from './components/ProfileDetailsPanel';
import { useDispatch, useSelector } from 'react-redux';
import { actionBookingInfo, actionCancelBooking } from '../../redux/features/room/roomSlice';


import { isObjectEmpty } from '../../utils/helpers'
import { BOOKING_STATUS } from '../../utils/constants'


const UserProfile = () => {
  const dispath = useDispatch();
  const { currentUser } = useSelector(state => {
    return state.auth
  })

  const { userBookingsData, isLoading } = useSelector(state => {
    return state.room
  })

  const navigate = history.navigate

  const wrapperRef = useRef();
  const buttonRef = useRef();

  const [isTabsVisible, setIsTabsVisible] = useState(false);

  const handleCancelBooking = async (e) => {
    const cancelBooking = async () => {
      const data = {
        "id": e,
        "status": BOOKING_STATUS.PENDING_CANCEL.id
      }
      await dispath(actionCancelBooking(data))
      dispath(actionBookingInfo(currentUser.id))
    }

    cancelBooking()
  }

  useOutsideClickHandler(wrapperRef, (event) => {
    if (!buttonRef.current.contains(event.target)) {
      setIsTabsVisible(false);
    }
  });

  const onTabsMenuButtonAction = () => {
    setIsTabsVisible(!isTabsVisible);
  };

  useEffect(() => {
    // const getInitialData = async () => {
    //   const userBookingsDataResponse = '/api/users/bookings'
    //   const userPaymentMethodsResponse = 'api/users/payment-methods'
    //   if (userBookingsDataResponse && userBookingsDataResponse.data) {
    //     setUserBookingsData({
    //       isLoading: false,
    //       data: userBookingsDataResponse.data.elements,
    //       errors: userBookingsDataResponse.errors,
    //     });
    //   }
    //   if (userPaymentMethodsResponse && userPaymentMethodsResponse.data) {
    //     setUserPaymentMethodsData({
    //       isLoading: false,
    //       data: userPaymentMethodsResponse.data.elements,
    //       errors: userPaymentMethodsResponse.errors,
    //     });
    //   }
    // };
    // getInitialData();
    !isObjectEmpty(currentUser) && dispath(actionBookingInfo(currentUser.id))
  }, [currentUser]);

  return (
    <>
      <div className="container mx-auto p-4 my-10 min-h-[530px]">
        <div className="mx-4">
          <button
            ref={buttonRef}
            onClick={onTabsMenuButtonAction}
            className="block md:hidden items-center px-4 py-1.5 border border-gray-300 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FontAwesomeIcon
              icon={isTabsVisible ? faXmark : faBars}
              size="lg"
            />
          </button>
        </div>
        {

          <Tabs isTabsVisible={isTabsVisible} wrapperRef={wrapperRef}>
            <TabPanel
              label="Thông tin cá nhân"
              icon={faAddressCard}
            >
              {
                !isObjectEmpty(currentUser) &&
                <ProfileDetailsPanel
                userDetails={currentUser}
                >
                </ProfileDetailsPanel>
              }

            </TabPanel>

            <TabPanel
              label="Lịch sử đặt phòng"
              icon={faHotel}
            >
              {
                !isObjectEmpty(userBookingsData) &&
                <BookingPanel
                  onCancelBooking={handleCancelBooking}
                  bookings={userBookingsData} />
              }

            </TabPanel>
          </Tabs>
        }

      </div>
    </>
  );
};

export default UserProfile;
