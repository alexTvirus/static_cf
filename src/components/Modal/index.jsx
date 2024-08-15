import { Form, Modal } from "antd";
import FormInput from "../FormInput";
import { useEffect, useState } from "react"

const ModalComponent = (props) => {
    //1. dữ liệu đưa vào từ props
    const { isModalOpen, titleModal, data, handleModalOk, handleModalCancel, handleModalSubmit } = props

    //2. hoặc lấy từ redux

    const initialValue = {
        title: "",
        createBy: "",
        isDone: ""
    }
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [titleModal, setTaskModal] = useState("Add task modal")

    const showTaskModal = () => {
        // setIsModalOpen(true);
    };


    const handleSubmit = (e) => {
        handleModalSubmit(e)
    }


    const [form] = Form.useForm();

    return (<>
        <Modal title={titleModal} open={isModalOpen} onOk={()=>{form.submit()}} onCancel={handleModalCancel}>
            <FormInput
                form={form}
                data={data}
                handleSubmit={handleSubmit}
            ></FormInput>


            {/* <Form
                name="basic"
                initialValues={
                    initialValue
                }
                form={form}
                onFinish={handleSubmit}
                autoComplete="off"
            >


                <Form.Item
                    name="title"

                    rules={[
                        {
                            required: true,
                            message: 'Please input your task name!',
                        },
                    ]}
                >
                    <Input placeholder='task name' />
                </Form.Item>
                <Form.Item
                    name="createBy"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your user name!',
                        },
                    ]}
                >
                    <Input placeholder='user name' />
                </Form.Item>

                <Form.Item
                    name="isDone"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

            </Form> */}
        </Modal>
    </>)

}

export default ModalComponent

