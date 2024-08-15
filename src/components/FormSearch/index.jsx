import { SearchOutlined } from "@ant-design/icons"
import { Button, Col, Form, Input, Row, Radio } from "antd"
import { useEffect, useState } from "react"
import Util from "../../util/util"
const delayHandle = Util.debounce()

const FormSearch = (props) => {
    //1. dữ liệu đưa vào từ props

    //2. hoặc lấy từ redux


    const { handleSearch } = props

    const prehandleSubmit = (e) => {
        handleSearch({ key: e.key })
    }

    const handleOnchangeSearchKey = (e) => {
        delayHandle(2000, () => handleSearch({ key: e.target.value }))
    }

    return (<>
        <Form onFinish={prehandleSubmit} layout="vertical">
            <Row
                gutter={[10]}
                style={{
                    justifyContent: "flex-end"
                }}
            >
                <Col
                    xs={24} sm={24} md={24} lg={12}>
                    <Form.Item
                        name="key"
                    >
                        <Input onChange={handleOnchangeSearchKey} placeholder="search key"

                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6}>

                    <Form.Item >
                        <Button htmlType="submit" icon={<SearchOutlined />} iconPosition="end">
                            Search
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>

    </>)
}

export default FormSearch