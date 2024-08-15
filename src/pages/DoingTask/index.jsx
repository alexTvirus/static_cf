
import { useSelector, useDispatch } from 'react-redux';
import { actionFetchAllTask } from "../../redux/features/task/taskSlice";
import { useEffect } from "react";

import MainContentComponent from "../../components/MainContent";
import { setIdSideBar } from "../../redux/features/sidebar/sidebarSlice";
import { Status } from "../../constants/constants";
import { Sidebar } from "../../constants/constants";
const DoingTaskPage = (props) => {

    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(setIdSideBar(Sidebar.DOINGTASK))
    })
    useEffect(() => {
        dispatch(actionFetchAllTask({
            "status.id": Status.DOING
        }))
    }, [])


    return (<div className='list-task'>
        <MainContentComponent></MainContentComponent>
    </div>)
}

export default DoingTaskPage