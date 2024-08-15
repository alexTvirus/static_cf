
import { useDispatch } from 'react-redux';
import { actionFetchAllTask } from "../../redux/features/task/taskSlice";
import { useEffect } from "react";
import { setIdSideBar } from "../../redux/features/sidebar/sidebarSlice";
import MainContentComponent from "../../components/MainContent";
import { Status } from '../../constants/constants';
import { Sidebar } from "../../constants/constants";

const NewTaskPage = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setIdSideBar(Sidebar.NEWTASK))
    })

    useEffect(() => {
        dispatch(actionFetchAllTask({
            "status.id": Status.NEW
        }))
    }, [])



    return (<div className='list-task'>
        <MainContentComponent></MainContentComponent>
    </div>)
}

export default NewTaskPage