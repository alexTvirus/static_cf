
import { useState } from "react";


import { message, Popconfirm, Button } from "antd";

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import HotelBookingApi from "../../../../../api/HotelBookingApi";

dayjs.extend(customParseFormat);
const dateFormat = 'DD-MM-YYYY';


const useDataTable = ({ handleGetUserProfile }) => {

    const columns = [
        {
            title: 'Thông tin',
            dataIndex: 'index',
            responsive: ["xs"],
            render: (_, record) => {
                return (<>

                </>)
            },
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            responsive: ["lg", 'md']
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            responsive: ["lg", 'md']
        }
        ,
        {
            className: "max-w-40",
            title: 'Mô tả',
            dataIndex: 'description',
            render: (_, record) => {
                return <p className=' content-overflow'>{record.description}</p>
            },
            responsive: ["lg", 'md', 'sm']

        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <div className='flex flex-wrap items-end flex-col gap-y-1 gap-x-1'>
                    <div className='shrink-0 w-fit'>
                        <Popconfirm
                            title="Xác nhận hủy"
                            description="Bạn có chắc chắn muốn hủy yêu thích không"
                            onConfirm={() => handleDelete(record)}
                        >
                            <Button danger>Hủy</Button>
                        </Popconfirm>
                    </div>
                </div>
            ),
        },
    ];


    const handleDelete = (options) => {
        const init = async () => {
            try {

                let rsp = await HotelBookingApi.updateWishlist(options.id, { "room_types": options.id })
                const data = rsp.data.data
                rsp = rsp.data
                message.success("Hủy thành công")
                await handleGetUserProfile({ "room_types": options.id })

            } catch (error) {
                message.error("Hủy thất bại")
            }
        }
        init()

    }


    return { columns }
}

export default useDataTable