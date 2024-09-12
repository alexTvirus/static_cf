import { Switch, Space, Table, Tag, List, Avatar, Button, Flex, Form, Input, Modal, message } from "antd";
import UserReviews from '../../user-reviews/UserReviews';
const ModalReview = (props) => {
    const {

        titleTaskModal,
        isModalOpen
    } = props
    const showModal = () => {
    };
    const handleOk = () => {
    };
    const handleCancel = () => {
    };
    const nextProps = { ...props }
    return (<>
        <Modal title={titleTaskModal} open={isModalOpen} onOk={() => ()=>{}} onCancel={handleCancel}>
            <UserReviews
                {...nextProps}
                // reviewData={reviewData}
                // handlePageChange={() => { }}
                // handlePreviousPageChange={() => { }}
                // handleNextPageChange={() => { }}
            />
        </Modal>
    </>)
}

export default ModalReview 