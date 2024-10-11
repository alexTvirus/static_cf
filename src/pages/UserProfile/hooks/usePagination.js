import { useState } from "react";



const usePagination = ({fetchUserBookingsData:fetchData}) => {
    const [pagination, setPagination] = useState({
        default_page: 1,
        default_perPage: 1,
        current_page: 1,
        per_page: 10,
        total: 0,
    });

    const [requestParams, setRequestParams] = useState(
        {
            params: { page: pagination.current_page, limit: pagination.per_page }
        });

    const handlePagination = async (page, pageSize) => {
        setRequestParams({ ...requestParams, params: { page: page, limit: pageSize } })
        fetchData({ params: { page: page, limit: pageSize } })
    }

    return {pagination , setPagination ,requestParams,setRequestParams, handlePagination}
}

export default usePagination