

const LoadMore = (props) => {
    const {
        defaultPageSize,
        pageSize,
        defaultCurrent,
        current,
        total,
        onChange
    } = props

    return (<>
        {!(total < pageSize)
            &&
            <div className="w-[100%] order-last">
                <div className="">
                    <div className=" text-center py-[30px] px-[20px]" >
                        <div
                            onClick={() => onChange(current, pageSize)}
                            className="cursor-pointer text-center border-solid bg-transparent inline-block test hover:border-[#000000]" >
                            <span className="gdlr-core-content">Xem thêm<i className="text-[16px] text-[#000000] " ></i></span>
                        </div>
                    </div>
                </div>

            </div>
        }

    </>)
}

export default LoadMore