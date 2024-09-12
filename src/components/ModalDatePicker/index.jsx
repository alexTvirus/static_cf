import { Switch, Space, Table, Tag, List, Avatar, Button, Flex, Form, Input, Modal, message } from "antd";
import { DateRangePicker } from '../ux/data-range-picker/DateRangePicker'

const ModalDatePicker = (props) => {
    const {
        titleTaskModal,
        isModalOpen
    } = props
    const showTaskModal = () => {
    };
    const handleOk = () => {
    };
    const handleCancel = () => {
    };
    const nextProps = { ...props }
    return (<>
        <Modal title={titleTaskModal} open={isModalOpen} onOk={() => taskForm.submit()} onCancel={handleCancel}>
            
        </Modal>
    </>)
}

export default ModalDatePicker 