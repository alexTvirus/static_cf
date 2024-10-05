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

const PacketReview = (props) => {
    const navigate = history.navigate

    const {
        onSearchPacket,
        packetsData
    } = props

    const handleSearchPacket = (id) => {
        let queryParams = {
            packet: id
        }
        const url = `${RouteName.HOTELS.path}?${queryString.stringify(queryParams)}`;
        navigate(url);
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
                                        CÁC GÓI ƯU ĐÃI
                                    </h3>
                                </div>
                            </div>
                        </div>

                    </div>
                    {
                        packetsData && packetsData.length > 0 &&
                        packetsData.map((item, index) => {
                            if (!(index & 1)) {
                                let order1 = 1
                                let order2 = 2

                                return (<>
                                    <div className='flex flex-wrap'>
                                        <div className={`md:order-1 sm:order-1 w-[100%] md:w-[60%] ${index===0?'':'md:pt-[50px]'}`}>

                                            <div onClick={() => onSearchPacket(item.id)} className="cursor-pointer transform transition duration-500 hover:scale-105">
                                                <div className="leading-none text-center px-[20px]  pb-[0px]" >
                                                    <div className="gdlr-core-image-item-wrap gdlr-core-media-image gdlr-core-image-item-style-round" >
                                                        <img src={item?.packet_images &&
                                                            item?.packet_images.length > 0 &&
                                                            item.packet_images[0].url} alt="" width="1300" height="716" title="chef-cook" />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className={` w-[100%] md:w-[40%] ${index===0?'':'md:pt-[50px]'} sm:order-2 md:order-2`}>
                                            <div className="pt-[42px]" >
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
                                                    <div className="">
                                                        <div className="text-left px-[20px]  pb-[30px] clearfix" >
                                                            <div className="cursor-pointer hover:border-[#000000] xemthem border-solid inline-block bg-transparent " href="#" id="">
                                                                <span onClick={() => onSearchPacket(item.id)} className="gdlr-core-content">Xem thêm<i className=" icon-arrow-right" ></i></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </>)
                            } else {
                                let order1 = 1
                                let order2 = 2
                                return (<>
                                    <div className='flex flex-wrap'>

                                        <div className={`test2 w-[100%] md:pt-[50px] md:w-[60%] sm:order-1 md:order-2`}>

                                            <div onClick={() => onSearchPacket(item.id)} className="cursor-pointer transform transition duration-500 hover:scale-105">
                                                <div className="leading-none text-center px-[20px]  pb-[0px]" >
                                                    <div className="gdlr-core-image-item-wrap gdlr-core-media-image gdlr-core-image-item-style-round" >
                                                        <img src={item?.packet_images &&
                                                            item?.packet_images.length > 0 &&
                                                            item.packet_images[0].url} alt="" width="1300" height="716" title="chef-cook" />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className={`test2 w-[100%] md:pt-[50px] md:w-[40%] sm:order-2 md:order-1`}>
                                            <div className="pt-[42px]" >
                                                <div className=""  >
                                                    <div className="">
                                                        <div className="text-left px-[20px]  pb-[30px] clearfix" >
                                                            <div className="">
                                                                <h3 className="text-3xl font-medium tracking-normal normal-case" >
                                                                    {item?.name_packet || ""}<span className="gdlr-core-title-item-title-divider gdlr-core-skin-divider"></span>
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
                                                    <div className="">
                                                        <div className="text-left px-[20px]  pb-[30px] clearfix" >
                                                            <div className="hover:border-[#000000] xemthem border-solid inline-block bg-transparent cursor-pointer" >
                                                                <span onClick={() => onSearchPacket(item.id)} className="gdlr-core-content">Xem thêm<i className=" icon-arrow-right" ></i></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>)
                            }


                        })
                    }

                </div>
            </div>
        </div>
    </>)
}

export default PacketReview