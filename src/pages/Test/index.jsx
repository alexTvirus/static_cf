import { useForm } from "antd/es/form/Form"
import FormInput from "../../components/FormInput"
import TableComponent from "../../components/Table"
import ModalComponent from "../../components/Modal"
import FormSearch from "../../components/FormSearch"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { actionAddTask, actionDeleteTask, actionFetchAllTask, actionUpdateTask } from "../../redux/features/task/taskSlice"


const TestComponent = () => {
    const dispatch = useDispatch()
    const { tasks } = useSelector(state => {
        return state.task
    })
    const [form] = useForm()
    const handleSubmitFormInput = async (param) => {
        async function inner(param) {
            dispatch(actionAddTask(param))
        }
        await inner(param)
        dispatch(actionFetchAllTask())
    }
    const handleDeleteFormInput = () => {

    }


    const handleEditItemTable = (param) => {
        setIsModalOpen(true)
        setDataModal(param)
    }

    const handleDeleteItemTable = async (param) => {
        async function inner(param) {
            dispatch(actionDeleteTask(param))
        }
        await inner(param)
        dispatch(actionFetchAllTask())
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [titleModal, setTaskModal] = useState("Add task modal")
    const [dataModal, setDataModal] = useState({});


    const handleModalOk = () => {

    }
    const handleModalCancel = () => {
        setIsModalOpen(false)

    }
    const handleModalSubmit = async (param) => {
        async function inner(param) {
            dispatch(actionUpdateTask(param))
        }
        await inner(param)
        dispatch(actionFetchAllTask())
        setIsModalOpen(false)
    }

    const handleSearch = (param) => {
        dispatch(actionFetchAllTask({
            "q":param.key
        }))
    }

    useEffect(() => {
        dispatch(actionFetchAllTask())
    }, [])

    return (<>
        <FormSearch
            handleSearch={handleSearch}
        ></FormSearch>
        <ModalComponent
            isModalOpen={isModalOpen}
            titleModal={titleModal}
            data={dataModal}
            handleModalOk={handleModalOk}
            handleModalCancel={handleModalCancel}
            handleModalSubmit={handleModalSubmit}
        ></ModalComponent>
        <FormInput
            handleSubmit={handleSubmitFormInput}
            handleDelete={handleDeleteFormInput}
            data={{}}
            form={form}
        ></FormInput>

        <TableComponent
            handleEditItem={handleEditItemTable}
            handleDeleteItem={handleDeleteItemTable}
            data={tasks}
        ></TableComponent>

    </>)
}

export default TestComponent