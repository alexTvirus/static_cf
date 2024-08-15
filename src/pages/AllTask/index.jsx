import { Spin } from "antd";
import MainLayout from "../../layouts/MainLayout"
import { useSelector, useDispatch } from 'react-redux';
import { actionFetchAllTask } from "../../redux/features/task/taskSlice";
import { fnchandleEditTask, actionSetPagination } from "../../redux/features/task/taskSlice";
import { useEffect } from "react";
import Task from "../../components/Task";
import MainContentComponent from "../../components/MainContent";
import "./style.scss"
import { Pagination } from "antd";
import { useSearchParams } from "react-router-dom";
import Util from "../../util/util";
import { setIdSideBar } from "../../redux/features/sidebar/sidebarSlice";
import { Sidebar } from "../../constants/constants";

const AllTaskPage = () => {
    let [searchParams, setSearchParams] = useSearchParams();

    const { pagination } = useSelector((state) => {
        return state.task
    })

    const dispatch = useDispatch()

    let params = Util.getSearchParams(searchParams)

    const handlePagination = async (page, pageSize) => {
        dispatch(actionSetPagination({ currentPage: page, perPage: pageSize }))
        dispatch(actionFetchAllTask({ ...params, _page: page, _limit: pageSize }))
    }

    useEffect(()=>{
        dispatch(setIdSideBar(Sidebar.ALLTASK))
    })

    useEffect(() => {
        dispatch(actionSetPagination({currentPage: pagination.defaultPage, perPage: pagination.defaultPerPage }))
        dispatch(actionFetchAllTask({ ...params, _page: pagination.defaultPage, _limit: pagination.defaultPerPage }))
    }, [searchParams])

   
    return (<>
        <div className='list-task'>
            <MainContentComponent
            ></MainContentComponent>
        </div>
        <div className="todoApp--footer">
            <Pagination align="center"
                defaultPageSize={pagination.defaultPerPage}
                onChange={(page, pageSize)=>handlePagination(page, pageSize)}
                pageSize={pagination.perPage}
                pageSizeOptions={[5, 10]}
                defaultCurrent={pagination.currentPage}
                current={pagination.currentPage}
                total={pagination.totalData || 0} />
        </div>
    </>
    )
}

export default AllTaskPage