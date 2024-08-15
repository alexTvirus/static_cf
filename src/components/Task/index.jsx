import { useState } from "react"
import "./style.scss"
import { useNavigate } from "react-router"
import { Card } from 'antd';
import { Divider } from 'antd';
import Util from "../../util/util";
import { useDispatch } from "react-redux";
import { actionSetCurrentTask } from "../../redux/features/task/taskSlice";
import { Route } from '../../constants/constants';


const Task = (props) => {
    let { description, status, createBy, title, id } = props.data

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleRedirectEditPage = (id) => {
        navigate(`/${Route.EDITTASK}/${id}`)
        dispatch(actionSetCurrentTask(props.data))
    }

    return (
        <Card
            className="task"
            key={id} bordered={true}>
            <p className="title"
                onClick={() => handleRedirectEditPage(id)} >Title: {title}</p>
            <p >Creator: {createBy}</p>
            <p className={Util.getObjectStatus(status.id).className}>Status: {status.name}</p>
            <Divider style={{
                backgroundColor: "blue"
            }} />
            <p className="description content-overflow">Description: </p>
            <p className="content-overflow" > {description}</p>
        </Card>)
}

export default Task