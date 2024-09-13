import { Switch, Space, Table, Tag, List, Avatar, Button, Flex, Form, Input, Modal, message } from "antd";
import UserReviews from '../../user-reviews/UserReviews';
const ModalReview = (props) => {
    const {
        onCancel,
        onOk,
        titleTaskModal,
        isModalOpen
    } = props
    const nextProps = { ...props }
    return (<>
        <Modal title={titleTaskModal} 
        open={isModalOpen} onOk={onOk} 
        onCancel={onCancel}
        footer={null}
        >
            <UserReviews
                {...nextProps}
            />
        </Modal>
    </>)
}

export default ModalReview 