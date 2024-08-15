import { Spin } from "antd";
import MainLayout from "../../layouts/MainLayout"
import { useSelector, useDispatch } from 'react-redux';
import { actionFetchAllTask } from "../../redux/features/task/taskSlice";
import { useEffect } from "react";
import Task from "../../components/Task";
import MainContentComponent from "../../components/MainContent";
import { setIdSideBar } from "../../redux/features/sidebar/sidebarSlice";
import { Status } from "../../constants/constants";
import { Sidebar } from "../../constants/constants";
const DoneTaskPage = (props) => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setIdSideBar(Sidebar.DONETASK))
    })

    useEffect(() => {
        dispatch(actionFetchAllTask({
            "status.id": Status.DONE
        }))
    }, [])



    return (<div className='list-task'>
        <MainContentComponent></MainContentComponent>
    </div>)
}

export default DoneTaskPage