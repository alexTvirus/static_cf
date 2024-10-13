import { useState } from "react"
import HotelBookingApi from "../../../api/HotelBookingApi"


const useRoomPagination = (props) => {
  const { setRooms,params } = props
  const [roomsPagination, setRoomsPagination] = useState({
    default_page: 1,
    default_perPage: 1,
    current_page: 1,
    per_page: 4,
    total: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  
  const handleRoomPagination = async (page, pageSize) => {
    setIsLoading(true)
    let rsp = await HotelBookingApi.getAllRoom({ params: { ...params, page: page, limit: (pageSize * 2) } });
    let data = rsp.data.data
    rsp = rsp.data
    if (data && data.length > 0) {
      setRooms(data)
      setRoomsPagination({ ...roomsPagination, total: rsp.total, current_page: page, per_page: (pageSize * 2) })
    }
    setIsLoading(false)
  }


  return {
    roomsPagination, setRoomsPagination,
    isLoading, setIsLoading,
    handleRoomPagination
  }
}
export default useRoomPagination