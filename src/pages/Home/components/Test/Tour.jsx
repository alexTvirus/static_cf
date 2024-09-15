// import './hotale-style-custom.scss'
// import './style-core.scss'
// import './tourmaster-global-style-custom.scss'
// import './tourmaster-room-style-custom.scss'
// import './page-builder.scss'
// import './gdlr-custom-icon.scss'
import { RouteName } from '../../../../routes/RouteName'
import { history } from '../../../../routes/helper/history'
import queryString from 'query-string';
import { useEffect } from 'react'
import Slider from "react-slick";
import React from "react";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Tour = (props) => {
    const navigate = history.navigate

    const {
        onBookTour,
        toursData
    } = props

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3
    };

    const slickData = () => {

    }

    return (<>
        <div className="gdlr-core-pbf-wrapper" >

            <div className="">

                <div className=" flex flex-wrap mx-auto leading-[1.7] text-[17px]">

                    <div className="w-[100%]">
                        <div className="">
                            <div className=" text-center pb-[30px] px-[20px]" >
                                <div className="">
                                    <h3 className="text-3xl font-medium text-slate-700 text-center my-2" >
                                        Tour
                                    </h3>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="w-[100%]">
                        <div className="">
                            <div className=" text-center pb-[30px] px-[20px]" >
                                <div className="">
                                    <Slider

                                        {...settings}>

                                        {
                                            toursData && toursData.length > 0 &&
                                            toursData.map((item, index) => {
                                                return (<>
                                                    <div key={index} className='tour-item'>
                                                        <div className='relative'>
                                                            <div className="gdlr-core-image-item-wrap gdlr-core-media-image" >
                                                                <img src={item?.packet_images &&
                                                                    item?.packet_images.length > 0 &&
                                                                    item.packet_images[0].url} alt="" width="1300" height="716" title="chef-cook" />
                                                            </div>

                                                            <button
                                                                className="hover-button opacity-0  bg-brand-secondary px-4 py-2 text-white whitespace-nowrap"
                                                                onClick={() => onBookTour(
                                                                    {
                                                                        hotelCode: item.room_type_id,
                                                                        checkInDate: item.tour_start_at,
                                                                        checkOutDate: item.tour_end_at,
                                                                        number_room: item.number_room,
                                                                        number_guest: item.number_room,
                                                                        packetCode: item.id
                                                                    })}
                                                            >
                                                                Đặt ngay
                                                            </button>
                                                        </div>
                                                        <div className=""  >
                                                            <div className="">
                                                                <div className="text-left px-[20px]  pb-[30px] clearfix" >
                                                                    <div className="">
                                                                        <h3 className="text-3xl font-medium tracking-normal normal-case" >
                                                                            {item?.name_packet || ""}
                                                                            {/* <span className="gdlr-core-title-item-title-divider gdlr-core-skin-divider"></span> */}
                                                                        </h3>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                                <div className="text-left px-[20px]  md:pb-[30px] clearfix" >
                                                                    <div className="text-lg font-normal tracking-normal normal-case text-slate-400" >
                                                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur dolorem beatae accusamus
                                                                            soluta accusantium rerum, quas atque dolor
                                                                            laboriosam, quasi adipisci a ?.</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </>)
                                            })
                                        }
                                    </Slider>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Tour