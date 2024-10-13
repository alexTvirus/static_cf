import { useState } from "react"
import HotelBookingApi from "../../../api/HotelBookingApi"


const useTourPagination = (props) => {
  const { setToursData ,params} = props
  const [toursPagination, setToursPagination] = useState({
    default_page: 1,
    default_perPage: 1,
    current_page: 1,
    per_page: 4,
    total: 0,
  })
  const [isTourLoading, setIsTourLoading] = useState(true)

  const handleTourPagination = async (page, pageSize) => {
    setIsTourLoading(true)
    let rsp = await HotelBookingApi.getTours({ params: { ...params, page: page, limit: (pageSize * 2) } });
    let data = rsp.data.data
    rsp = rsp.data
    if (data && data.length > 0) {
      setToursData(data)
      setToursPagination({ ...toursPagination, total: rsp.total, current_page: page, per_page: (pageSize * 2) })
    }
    setIsTourLoading(false)
  }

  return {
    toursPagination, setToursPagination,
    isTourLoading, setIsTourLoading,
    handleTourPagination
  }
}
export default useTourPagination