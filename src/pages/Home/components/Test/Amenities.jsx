import './hotale-style-custom.scss'
import './style-core.scss'
import './tourmaster-global-style-custom.scss'
import './tourmaster-room-style-custom.scss'
import './page-builder.scss'
import './gdlr-custom-icon.scss'

import './icon.scss'


const Amenities = (props) => {
    const {
        amenitiesData
    } = props

    return (<>
        <div className="gdlr-core-pbf-wrapper" >
            <div className="max-w-[1000px] flex flex-wrap justify-center mx-auto " >

                <div className="w-[100%]">
                    <div className="">
                        <div className=" text-center pb-[30px] px-[20px]" >
                            <div className="">
                                <h3 className="text-3xl font-medium text-slate-700 text-center my-2" >
                                    TIỆN NGHI KHÁCH SẠN
                                </h3>
                            </div>
                        </div>
                    </div>

                </div>
                {
                    amenitiesData && amenitiesData.length > 0 &&
                    amenitiesData.map((item, index) => {
                        return (<>
                            <div key={`${item.id}-${index}`} className=" gdlr-core-column-12" id="gdlr-core-column-10">

                                <div className="">
                                    <div className="leading-none px-[20px]  pb-[30px] text-center">
                                        <i className="text-[45px] max-w-[45px] max-h-[45px] min-w-[45px] min-h-[45px] text-center inline-block " >
                                            <img className='block object-cover w-full h-full' src={item.image} alt={item.name} />
                                        </i>
                                    </div>
                                </div>
                                <div className="">
                                    <div className=" text-center pb-[30px] px-[20px]" >
                                        <div className="">
                                            <h3 className="text-xl font-medium tracking-normal normal-case" >
                                            {item.name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </>)
                    })
                }

            </div>
        </div>

    </>)
}

export default Amenities