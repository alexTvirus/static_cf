import { useState } from "react"
import HotelBookingApi from "../../../api/HotelBookingApi"


const usePacketPagination = (props) => {
    const {setPacketsData,params} = props
    const [packetsPagination, setPacketsPagination] = useState({
        default_page: 1,
        default_perPage: 1,
        current_page: 1,
        per_page: 4,
        total: 0,
    })
    const [isPacketLoading, setIsPacketLoading] = useState(true)

    const handlePacketPagination = async (page, pageSize) => {
        setIsPacketLoading(true)
        let rsp = await HotelBookingApi.getPackets({ params: { ...params, page: page, limit: (pageSize * 2) } });
        let data = rsp.data.data
        rsp = rsp.data
        if (data && data.length > 0) {
    
          setPacketsData(data)
          setPacketsPagination({ ...packetsPagination, total: rsp.total, current_page: page, per_page: (pageSize * 2) })
        }
        setIsPacketLoading(false)
      }

    return { 
        packetsPagination, setPacketsPagination ,
        isPacketLoading, setIsPacketLoading,
        handlePacketPagination
    }
}
export default usePacketPagination