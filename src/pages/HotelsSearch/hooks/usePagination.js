import { useState } from "react";



const usePagination = ({ fetchData }) => {
    const [pagination, setPagination] = useState({
        default_page: 1,
        default_perPage: 1,
        current_page: 1,
        per_page: 4,
        total: 0,
    });

    const [requestParams, setRequestParams] = useState(
        {
            params: { page: pagination.current_page, limit: pagination.per_page }
        });


    const handlePagination = async (page, pageSize) => {
        let param = { ...requestParams?.params, page: page, limit: (pageSize * 2) }
        param = { ...requestParams, params: param }
        setRequestParams(param)
        fetchData(param)
    }

    return { pagination, setPagination, requestParams, setRequestParams, handlePagination }
}

export default usePagination