import { useSelector } from 'react-redux';
import Task from "../Task";
import { Spin, Pagination } from "antd";


const MainContentComponent = (props) => {
    const { tasks, isLoading } = useSelector((state) => {
        return state.task
    })

    const renderListTask = (tasks) => {
        if (!tasks || (tasks && tasks.length === 0)) {
            return (<>
                <div> No tasks</div>
            </>)
        }
        if (tasks && tasks.length > 0) {
            return tasks.map((item) => {
                return (
                    <Task
                        key={item.id}
                        data={item}>
                    </Task>
                )
            })
        }
    }
    return (<>
        {isLoading ? <Spin /> : renderListTask(tasks)}
    </>)

}

export default MainContentComponent