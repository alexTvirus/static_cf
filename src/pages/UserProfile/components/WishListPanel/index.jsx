
import OverlayComponent from '../../../../components/OverLay'

import { Switch, Space, Select, Table, Tag, List, Avatar, Flex, Form, Input, Modal, message, Pagination } from "antd";



const WishListPanel = (
  {
    isLoading,
    wishListdata,
    columns,
    // onGetUserProfile: handleGetUserProfile,
    // onGetRoomTypeData : handleGetRoomTypeData
  }
) => {

  // list wishlist tu currentuser , thong tin roomtype >> name, updated_at

  // nut xoa wishlist

  // useEffect(() => {
  //   if (currentUser?.wishlists) {
  //     let roomTypes = currentUser?.wishlists.map((item) => {
  //       return item.room_type_id
  //     })
  //     fetchData({ params: { roomTypes: roomTypes } })
  //   }

  // }, [currentUser])


  // const [isLoading, setIsLoading] = useState(false);

  // function parseParams(params) {
  //   debugger
  //   const keys = Object.keys(params)
  //   let options = ''

  //   keys.forEach((key) => {
  //     const isParamTypeObject = typeof params[key] === 'object'
  //     const isParamTypeArray = isParamTypeObject && params[key].length >= 0

  //     if (isParamTypeArray) {
  //       options += `${key}=[${params[key].toString()}]&`
  //     } else {
  //       options += `${key}=${params[key]}&`
  //     }
  //   })

  //   return options ? options.slice(0, -1) : options
  // }

  // const fetchData = async (options) => {
  //   setIsLoading(true)
  //   try {

  //     let param = { ...options?.params, all: 1 }
  //     param = {
  //       ...options, params: param,
  //       paramsSerializer: (params) => parseParams(params),
  //     }
  //     let rsp = await HotelBookingApi.getAllRoom(param)
  //     const data = rsp.data.data
  //     rsp = rsp.data

  //     setWishListdata(data)
  //   } catch (error) {
  //     message.error(error)
  //   }

  //   setIsLoading(false)
  // }

  // const { pagination, setPagination, requestParams, setRequestParams, handlePagination }
  //   = usePagination({ fetchData })

  // const { columns, wishListdata, setWishListdata }
  //   = useDataTable({ setIsLoading, fetchData, requestParams, handleGetUserProfile })

  return (
    <>
      <OverlayComponent
        isLoading={isLoading}
      ></OverlayComponent>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {wishListdata &&

          <Table className='mb-3' pagination={false}
            columns={columns} dataSource={wishListdata} rowKey={"id"} />
        }

      </div>

    </>
  );
};

export default WishListPanel;
