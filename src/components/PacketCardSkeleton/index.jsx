const PacketCardSkeleton = () => {
  return (
    <>
      <div className="gdlr-core-pbf-wrapper animate-pulse" data-testid="hotel-view-card-skeleton">

        <div className="">

          <div className=" flex flex-wrap mx-auto leading-[1.7] text-[17px]">

            <div className="w-[100%]">
              <div className="">
                <div className=" text-center pb-[30px] px-[20px]" >
                  <div className="">
                    <h3 className="text-3xl font-medium text-slate-700 text-center my-2" >
              
                    </h3>
                  </div>
                </div>
              </div>

            </div>
            <div className='flex flex-wrap'>
              <div className={` w-[100%] md:w-[60%] md:pt-[50px]'`}>

                <div className="">
                  <div className="leading-none text-center px-[20px]  pb-[0px]" >
                    <div className="gdlr-core-image-item-wrap gdlr-core-media-image gdlr-core-image-item-style-round" >
                      <div className="md:w-[1300px] md:h-[300px]">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0" y="0" width="100%" height="100%" fill="#e0e0e0" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className={` w-[100%] md:w-[40%] md:pt-[50px] `}>
                <div className="pt-[42px]" >
                  <div className=""  >
                    <div className="">
                      <div className="text-left px-[20px]  pb-[30px] clearfix" >
                        <div className="">
                          <h3 className="text-3xl font-medium tracking-normal normal-case" >
                            <div className="h-2 bg-gray-200 rounded-full w-40 mb-4"></div>
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <div className="text-left px-[20px]  md:pb-[30px] clearfix" >
                        <div className="text-lg font-normal tracking-normal normal-case text-slate-400" >
                          <div className="h-2 bg-gray-200 rounded-full w-40 mb-4"></div>
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <div className="text-left px-[20px]  pb-[30px] clearfix" >
                        <div className="cursor-pointer hover:border-[#000000] xemthem border-solid inline-block bg-transparent " >
                          <div className="h-2 bg-gray-200 rounded-full w-40 mb-4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};
export default PacketCardSkeleton;
