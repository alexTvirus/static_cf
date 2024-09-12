import './hotale-style-custom.scss'
import './style-core.scss'
import './tourmaster-global-style-custom.scss'
import './tourmaster-room-style-custom.scss'
import './page-builder.scss'
import './gdlr-custom-icon.scss'
import {RouteName} from '../../../../routes/RouteName'
import {history} from '../../../../routes/helper/history'
import queryString from 'query-string';

const PacketReview = () => {
    const navigate = history.navigate

    const handleSearchPacket = (id)=>{
        let queryParams = {
            packet:id
        }
        const url = `${RouteName.HOTELS.path}?${queryString.stringify(queryParams)}`;
        navigate(url);
    }

    return (<>
        <div className="gdlr-core-pbf-wrapper" id="gdlr-core-wrapper-7">

            <div className="">

                <div className=" flex flex-wrap mx-auto leading-[1.7] text-[17px]">

                    <div className="w-[100%]">
                        <div className="">
                            <div className=" text-center pb-[30px] px-[20px]" >
                                <div className="">
                                    <h3 className="text-3xl font-medium text-slate-700 text-center my-2" >
                                        ƯU ĐÃI
                                    </h3>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="test2 w-[100%] md:w-[60%]" id="gdlr-core-column-20">

                        <div className="">
                            <div className="leading-none text-center px-[20px]  pb-[0px]" >
                                <div className="gdlr-core-image-item-wrap gdlr-core-media-image gdlr-core-image-item-style-round" >
                                    <img src="http://localhost/upload/chef-cook.jpg" alt="" width="1300" height="716" title="chef-cook" />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="test2 w-[100%] md:w-[40%]" id="gdlr-core-column-21">
                        <div className="pt-[42px]" >
                            <div className=""  >
                                <div className="">
                                    <div className="text-left px-[20px]  pb-[30px] clearfix
                                    " >
                                        <div className="">
                                            <h3 className="text-3xl font-medium tracking-normal normal-case" >
                                                Kỳ nghỉ Gia đình - 3 Ngày 2 Đêm<span className="gdlr-core-title-item-title-divider gdlr-core-skin-divider"></span>
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
                                        <a className="hover:border-[#000000] xemthem border-solid inline-block bg-transparent " href="#" id="">
                                            <span onClick={()=>handleSearchPacket(3)} className="gdlr-core-content">Xem thêm<i className=" icon-arrow-right" ></i></span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="test2 w-[100%] md:pt-[50px] md:w-[40%]" id="gdlr-core-column-22">
                        <div className="pt-[42px] ">
                            <div className="">
                                <div className="text-left px-[20px]  pb-[30px] clearfix
                                    " >
                                    <div className="">
                                        <h3 className="text-3xl font-medium tracking-normal normal-case" >
                                            Kỳ nghỉ Gia đình - 3 Ngày 2 Đêm<span className="gdlr-core-title-item-title-divider gdlr-core-skin-divider"></span>
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
                                    <a className="hover:border-[#000000] xemthem border-solid inline-block bg-transparent " href="#" id="">
                                        <span className="gdlr-core-content">Xem thêm<i className=" icon-arrow-right" ></i></span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="test2 w-[100%] md:pt-[50px] md:w-[60%]" id="gdlr-core-column-23">
                        <div className=" test3" >
                            <div className="gdlr-core-pbf-column-content clearfix">
                                <div className="">
                                    <div className="leading-none text-center px-[20px]  pb-[0px]" >
                                        <div className="gdlr-core-image-item-wrap gdlr-core-media-image gdlr-core-image-item-style-round" >
                                            <img src="http://localhost/upload/chef-cook.jpg" alt="" width="1300" height="716" title="chef-cook" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="test2 w-[100%] md:pt-[50px] md:w-[60%]" id="gdlr-core-column-24">
                        <div className="test2 " >
                            <div className="test2 clearfix ">
                                <div className="">
                                    <div className="leading-none text-center px-[20px]  pb-[0px]" >
                                        <div className="gdlr-core-image-item-wrap gdlr-core-media-image gdlr-core-image-item-style-round" >
                                            <img src="http://localhost/upload/chef-cook.jpg" alt="" width="1300" height="716" title="chef-cook" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="test2 w-[100%] md:pt-[50px] md:w-[40%]" id="gdlr-core-column-25">
                        <div className="test2 pt-[42px]" >
                            <div className="clearfix"  >
                                <div className="">
                                    <div className="text-left px-[20px]  pb-[30px] clearfix
                                    " >
                                        <div className="">
                                            <h3 className="text-3xl font-medium tracking-normal normal-case" >
                                                Kỳ nghỉ Gia đình - 3 Ngày 2 Đêm<span className="gdlr-core-title-item-title-divider gdlr-core-skin-divider"></span>
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
                                        <a className="hover:border-[#000000] xemthem border-solid inline-block bg-transparent " href="#" id="">
                                            <span className="gdlr-core-content">Xem thêm<i className=" icon-arrow-right" ></i></span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-[100%]">
                        <div className="">
                            <div className=" text-center py-[30px] px-[20px]" >
                                <a className="text-center border-solid bg-transparent inline-block test hover:border-[#000000]" href="room-grid-style-1.html" >
                                    <span className="gdlr-core-content">View All Rooms<i className="text-[16px] text-[#000000]  icon-arrow-right" ></i></span>
                                </a>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </>)
}

export default PacketReview