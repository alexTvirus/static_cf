import React, { useState, useEffect, useRef } from 'react';
import Tabs from '../../components/ux/tabs/Tabs';
import TabPanel from '../../components/ux/tab-panel/TabPanel';
import {
  faAddressCard,
  faHotel,
  faKey
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
import ChangePasswordPanel from './components/ChangePasswordPanel';


const UserProfile = () => {
  const dispath = useDispatch();
  const { currentUser, isUserUpdated, isLoading } = useSelector(state => {
    return state.auth
  })

  const { userBookingsData, isLoading: roomLoading } = useSelector(state => {
    return state.room
  })

  debugger

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
                  isUserUpdated={isUserUpdated}
                  userDetails={currentUser}
                >
                </ProfileDetailsPanel>
              }

            </TabPanel>
            <TabPanel
              label="Thay đổi mật khẩu"
              icon={faKey}
            >
              {
                !isObjectEmpty(currentUser) &&
                <ChangePasswordPanel
                  isLoading={isLoading}
                  userDetails={currentUser}
                >
                </ChangePasswordPanel>
              }

            </TabPanel>
            <TabPanel
              label="Lịch sử đặt phòng"
              icon={faHotel}
            >
              {
                !isObjectEmpty(userBookingsData) &&
                <BookingPanel
                  isLoading = {roomLoading}
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
