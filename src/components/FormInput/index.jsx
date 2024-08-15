import { useEffect, useState } from "react"
import { Button, DatePicker, Form, Input } from 'antd';
import "./style.scss"
import { Row, Col } from 'antd';
import { Radio } from 'antd';
import moment from 'moment';
import { message, Popconfirm } from 'antd';
import TextArea from "antd/es/input/TextArea";
import { Status } from "../../constants/constants";
import Util from "../../util/util";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const FormInput = (props) => {
    //1. dữ liệu đưa vào từ props

    //2. hoặc lấy từ redux

    const { handleSubmit, handleDelete, data, form } = props

    const dateFormat = 'DD/MM/YYYY';

    const [value, setValue] = useState(1);
    const onChangeRadioButton = (e) => {
        // setValue(e.target.value);
    };

    const handleOnchageInput = (e) => {

    }

    const validateNotifyDate = (rule, value) => {
        if (value) {
            let notify = moment(moment(value.$d).format("DD/MM/YYYY"), "DD/MM/YYYY")
            let now = new Date();
            now = moment(moment(now).format("DD/MM/YYYY"), "DD/MM/YYYY");
            if (notify.isBefore(now)) {
                return Promise.reject('notify date must be greater now');
            }
        }
        return Promise.resolve();
    }


    useEffect(() => {

        if (data && data.id) {
            let task = {}
            for (let key in data) {

                if (key === "createAtString") {
                    task = {
                        ...task,
                        [key]: dayjs(data[key], dateFormat)
                    }
                } else {
                    task = {
                        ...task,
                        [key]: data[key]
                    }
                }


            }
            debugger
            form.setFieldsValue(task)
        }

        else {

            // form.setFieldsValue({
            //     "createAtString": dayjs('2015/01/01', dateFormat)
            // }
            // )
        }

    }, [data])


    const prehandleSubmit = (e) => {
        debugger
        // createAtString: moment(e.notifyAt.$d).format("DD/MM/YYYY")
        // notifyAtTimestamp: moment(task.notifyAt, "DD/MM/YYYY").valueOf(),
        let x = moment(e.createAtString.$d, "DD/MM/YYYY").valueOf()
        let newTask = {
            title: e.title,
            createAtString: moment(e.createAtString.$d).format("DD/MM/YYYY"),
            description: e.description,
            status: e.status,
            createBy: e.createBy,
        }
        if (data && data.id)
            handleSubmit({
                ...newTask,
                id: data.id,
                createAt: data.createAt,
            })
        else
            handleSubmit({
                ...newTask,
                createAt: moment(e.createAtString.$d, "DD/MM/YYYY").valueOf(),
                status: Status.NEW
            })
        form.resetFields()
    }

    const handleResetForm = () => {
        form.resetFields()
    }

    const handleDeleteTask = (id) => {
        handleDelete(id)
    }

    const confirmDelete = (e) => {
        handleDeleteTask(data.id)
        message.success('Click on Yes');
    };
    const cancelDelete = (e) => {
        message.error('Click on No');
    };

    return (<>

        <Form form={form} onFinish={prehandleSubmit} layout="vertical">

            <Row
                style={{
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Col xs={24} sm={24} md={24} lg={12}>
                    <Form.Item
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your title!',
                            },
                        ]}
                    >
                        <Input placeholder="title"
                            onChange={handleOnchageInput}
                        />
                    </Form.Item>
                </Col>
            </Row>


            <Row
                style={{
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Col xs={24} sm={24} md={24} lg={12}>
                    <Form.Item
                        name="createBy"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your name!',
                            },
                        ]}
                    >
                        <Input placeholder="your name"
                            onChange={handleOnchageInput}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row
                style={{
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Col xs={24} sm={24} md={24} lg={12}>

                    <Form.Item
                        name="createAtString"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your notify date!',
                            },
                            { validator: validateNotifyDate }
                        ]}
                    >
                        <DatePicker format={'DD/MM/YYYY'} className="todoApp--main__date-picker-input" needConfirm />
                    </Form.Item>
                </Col>
            </Row>


            <Row
                style={{
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Col xs={24} sm={24} md={24} lg={12}>
                    <Form.Item
                        name="description"

                    >
                        <TextArea showCount placeholder="your description"
                            onChange={handleOnchageInput}
                        />
                    </Form.Item>
                </Col>
            </Row>
            {data &&
                <Row
                    style={{
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Col xs={24} sm={24} md={24} lg={12}>
                        <Form.Item
                            name="status"
                        >
                            <Radio.Group onChange={onChangeRadioButton} value={value}>
                                {
                                    Util.getListStatus().map(item => {
                                        return <Radio key={item.id} value={item.id}>{item.name}</Radio>
                                    })
                                }
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
            }


            <Row
                style={{
                    justifyContent: "center",
                    alignItems: "center"
                }}
                gutter={[10]}>
                <Col xs={24} sm={24} md={4} lg={4}>
                    <Form.Item >
                        <Button type="primary" htmlType="submit" >
                            save
                        </Button>
                    </Form.Item>
                </Col>
                {data && <Col xs={24} sm={24} md={4} lg={4}>
                    <Form.Item >
                        <Button type="primary" onClick={() => handleResetForm()} >
                            reset
                        </Button>
                    </Form.Item>
                </Col>}
                {data && <Col xs={24} sm={24} md={4} lg={4}>
                    <Form.Item >
                        <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger>
                                delete
                            </Button>
                        </Popconfirm>
                    </Form.Item>
                </Col>}

            </Row>

        </Form >

    </>)
}

export default FormInput