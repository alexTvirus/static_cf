import { Row, Col, Layout } from 'antd';

import { Form, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux';
import { actionFetchAllTask, actionSetSearchKey } from "../../redux/features/task/taskSlice";
import FormSearchTask from '../FormSearchTask';
import { Route } from '../../constants/constants';
import Util from "../../util/util"


const { Header } = Layout;
const HeaderComponent = () => {
    const navigate = useNavigate()

    const handleCreateTask = () => {
        navigate(`/${Route.CREATETASK}`)
    }
    const handleSearch = (params) => {
        navigate(`/${Route.ALLTASK}?q=${params.key}`)
    }

    return (<>
        <Header
            style={{
                paddingTop: "24px",
                height: "auto",
                width: "100%",
                display: 'flex',
                justifyContent: "space-between"
            }}
        >
            <Button onClick={() => handleCreateTask()} type="primary">create new task</Button>
            <Layout
                style={{
                    background: "none",
                    maxWidth: "400px"
                }}
            >
                <FormSearchTask
                    handleSearch={handleSearch}
                ></FormSearchTask>
            </Layout>


        </Header>

    </>)
}

export default HeaderComponent