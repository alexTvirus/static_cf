import { useState } from "react";
import HotelBookingApi from "../../../../../api/HotelBookingApi";
import usePagination from "./usePagination";
import useDataTable from "./useDataTable";
import { message } from "antd";



const useWishlist = ({handleGetUserProfile}) => {
    const [isLoading, setIsLoading] = useState(false);

    const [wishListdata, setWishListdata] = useState();

    function parseParams(params) {
        const keys = Object.keys(params)
        let options = ''

        keys.forEach((key) => {
            const isParamTypeObject = typeof params[key] === 'object'
            const isParamTypeArray = isParamTypeObject && params[key].length >= 0

            if (isParamTypeArray) {
                options += `${key}=[${params[key].toString()}]&`
            } else {
                options += `${key}=${params[key]}&`
            }
        })

        return options ? options.slice(0, -1) : options
    }

    const fetchDataWishlist = async (options) => {
        setIsLoading(true)
        try {

            let param = { ...options?.params, all: 1 }
            param = {
                ...options, params: param,
                paramsSerializer: (params) => parseParams(params),
            }
            let rsp = await HotelBookingApi.getAllRoom(param)
            const data = rsp.data.data
            rsp = rsp.data

            setWishListdata(data)
        } catch (error) {
            message.error(error)
        }

        setIsLoading(false)
    }

    const { columns }
        = useDataTable({handleGetUserProfile })

    return { isLoading,fetchDataWishlist ,columns, wishListdata, setWishListdata }
}

export default useWishlist