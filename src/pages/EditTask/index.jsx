import { useNavigate, useParams } from "react-router-dom"
import FormInputTask from "../../components/FormInputTask"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { actionFetchTaskById ,actionDeleteTask} from "../../redux/features/task/taskSlice"
import { actionUpdateTask, resetCurrentTask } from "../../redux/features/task/taskSlice"
import { setIdSideBar } from "../../redux/features/sidebar/sidebarSlice"
import { Spin } from "antd"
import Util from "../../util/util"


const EditTaskPage = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const { currentTask, isLoading } = useSelector((state) => {
        return state.task
    })

    const navigate = useNavigate()

    useEffect(() => {
        if (Util.isObjectEmpty(currentTask))
            dispatch(actionFetchTaskById({ id: params.id }))
    }, [])

    const handleEditTask = (task) => {
        task = { ...task, status: Util.getObjectStatus(task.status) }
        dispatch(actionUpdateTask(task))
        dispatch(resetCurrentTask())
        navigate("/all-task")
    }

    const handleDeleteTask = async (id) => {
        dispatch(actionDeleteTask(id))
        navigate("/all-task")
        dispatch(resetCurrentTask())
    }
    return (<>
        {isLoading ? <Spin /> : <FormInputTask
            handleSubmit={handleEditTask}
            handleDelete={handleDeleteTask}
            data={currentTask}
        ></FormInputTask>}

    </>)
}

export default EditTaskPage