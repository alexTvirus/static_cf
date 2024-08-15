import { Button, Flex, Table } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { actionFetchAllTask, actionAddTask, actionUpdateTask } from "../../redux/features/task/taskSlice"
const TableComponent = (props) => {

    //1 . lấy dữ liệu từ props

    //2. hoặc tự lấy dữ liệu từ redux

    // const { tasks } = useSelector(state => {
    //     return state.task
    // })
    // dispatch(actionFetchAllTask())

    const { handleEditItem, handleDeleteItem, data } = props

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id'
        },
        // {
        //     title: 'Title',
        //     dataIndex: 'title',
        //     key: 'title',
        //     render: (_, record) => (
        //         <Flex gap="middle" >
        //             <span className={record.isDone ? "done" : ""}>{record.taskName}</span>
        //         </Flex>
        //     ),
        // },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Create by',
            dataIndex: 'createBy',
            key: 'createBy',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Flex gap="middle" >
                    <Button onClick={() => handleShowEditModal(record)}> Edit</Button>
                    <Button onClick={() => handleDelete(record.id)} danger>Delete</Button>
                </Flex>
            ),
        },
    ];



    const handleShowEditModal = (task) => {
        handleEditItem(task)
    }

    const handleDelete = async (id) => {
        handleDeleteItem(id)
    }


    return (<>
        <Table columns={columns} dataSource={data} rowKey={"id"} />
    </>)

}

export default TableComponent

