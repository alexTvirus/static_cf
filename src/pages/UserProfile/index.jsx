import React, { useState, useEffect, useRef, useCallback } from 'react';
import Tabs from '../../components/ux/tabs/Tabs';
import TabPanel from '../../components/ux/tab-panel/TabPanel';
import {
  faAddressCard,
  faHotel,
  faKey,
  faHeart
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import useOutsideClickHandler from '../../hooks/useOutsideClickHandler';
import { history } from '../../routes/helper/history';
import BookingPanel from './components/BookingPanel';
import WishListPanel from './components/WishListPanel';
import ProfileDetailsPanel from './components/ProfileDetailsPanel';
import { useDispatch, useSelector } from 'react-redux';
import { actionBookingInfo, actionCancelBooking } from '../../redux/features/room/roomSlice';
import { actionGetUserProfile, actionUpdateWishList } from '../../redux/features/auth/authSlice';

import _debounce from 'lodash/debounce';
import { isObjectEmpty } from '../../utils/helpers'
import { BOOKING_STATUS } from '../../utils/constants'
import ChangePasswordPanel from './components/ChangePasswordPanel';
import usePagination from './hooks/usePagination';
import HotelBookingApi from '../../api/HotelBookingApi';
import { message } from 'antd';
import useWishlist from './components/WishListPanel/hooks/useWishlist';


const UserProfile = () => {
  const dispatch = useDispatch();
  const { currentUser, isUserUpdated, isLoading } = useSelector(state => {
    return state.auth
  })

  const [userBookingsData, setUserBookingsData] = useState({})
  const [roomLoading, setRoomLoading] = useState(true)


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
      await dispatch(actionCancelBooking(data))
      dispatch(actionBookingInfo(currentUser.id))
    }

    cancelBooking()
  }

  useOutsideClickHandler(wrapperRef, (event) => {
    if (!buttonRef.current.contains(event.target)) {
      setIsTabsVisible(false);
    }
  });

  const handleGetUserProfile = (options) => {
    dispatch(actionUpdateWishList(options.room_types))
  }

  const onTabsMenuButtonAction = () => {
    setIsTabsVisible(!isTabsVisible);
  };

  // useEffect(() => {

  // }, [currentUser]);

  const fetchUserBookingsData = async (options) => {
    setRoomLoading(true)
    try {
      let param = { ...options?.params }
      param = { ...options, params: param }
      let rsp = await HotelBookingApi.getBookingInfo(options.id, param)
      const data = rsp.data.data
      rsp = rsp.data

      setPagination({ ...pagination, total: rsp.total, current_page: rsp.current_page, per_page: rsp.per_page })
      setUserBookingsData(data)
    } catch (error) {
      message.error("lỗi call api")
    }

    setRoomLoading(false)
  }

  // ----

  const handleGetRoomTypeData = (options) => {

  }

  // ----

  const { pagination, setPagination, requestParams, setRequestParams, handlePagination }
    = usePagination({ fetchUserBookingsData })

  //------ xu ly delay call api

  const [executeDebouncer, setExecuteDebouncer] = useState(false);

  const debounceFn = useCallback(_debounce(() => setExecuteDebouncer(true), 600), []);

  useEffect(() => {
    if (executeDebouncer) {
      setExecuteDebouncer(false);
      !isObjectEmpty(currentUser) && fetchUserBookingsData({ ...requestParams, id: currentUser.id })
    }
  }, [executeDebouncer]);

  useEffect(() => {
    debounceFn();
  }, [currentUser]);

  // ----

  const { isLoading: isWishlistLoading,fetchDataWishlist ,columns, wishListdata}
    = useWishlist({handleGetUserProfile})

  useEffect(() => {
    if (currentUser?.wishlists) {
      let roomTypes = currentUser?.wishlists.map((item) => {
        return item.room_type_id
      })
      fetchDataWishlist({ params: { roomTypes: roomTypes } })
    }

  }, [currentUser])

  // ---
  useEffect(() => {
    dispatch(actionGetUserProfile())
  }, []);

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
                  isLoading={roomLoading}
                  onCancelBooking={handleCancelBooking}
                  bookings={userBookingsData} />
              }

            </TabPanel>
            <TabPanel
              label="Danh sách yêu thích"
              icon={faHeart}
            >
              {
                !isObjectEmpty(wishListdata) &&
                <WishListPanel
                  columns={columns}
                  wishListdata={wishListdata}
                  isLoading = {isWishlistLoading}
                />
              }

            </TabPanel>
          </Tabs>
        }

      </div>
    </>
  );
};

export default UserProfile;
