import { useDispatch } from "react-redux"
import FormInputTask from "../../components/FormInputTask"
import MainLayout from "../../layouts/MainLayout"
import { actionAddTask ,actionDeleteTask,resetCurrentTask} from "../../redux/features/task/taskSlice"
import { setIdSideBar } from "../../redux/features/sidebar/sidebarSlice"
import GenID from "../../util/genId"
import Util from "../../util/util"
import { useNavigate } from "react-router"
import { Route } from "../../constants/constants"
const CreateTaskPage = () => {

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const handleAddTask = async (task) => {
        task = { ...task, status: Util.getObjectStatus(task.status), id: await GenID.genId() }
        dispatch(actionAddTask(task))
        navigate(`/${Route.NEWTASK}`)
    }

    return (<>
        <FormInputTask
            handleSubmit={handleAddTask}
            data={null}
        ></FormInputTask>
    </>)
}

export default CreateTaskPage