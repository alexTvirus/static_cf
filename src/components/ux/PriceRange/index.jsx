import { Slider, ConfigProvider } from 'antd';
import React, { useState } from 'react';

const PriceRange = (props) => {
    const {
        selectedPrice,
        priceRangeData,
        onPriceRangeUpdate
    } = props
    return (
        <>
            <ConfigProvider
                theme={{
                    components: {
                        Slider: {
                            handleColor: "#074498",
                            dotActiveBorderColor: "#074498",
                            handleActiveColor: "#074498",
                            handleActiveOutlineColor: "#074498",
                            trackHoverBg: "#074498",
                            trackBg: "#074498",
                        },
                    },
                }}
            >
                <Slider
                    step={100000}
                    onChange={onPriceRangeUpdate}
                    value={[selectedPrice.min,selectedPrice.max]}
                    min={priceRangeData.min}
                    max={priceRangeData.max}
                    range={{ draggableTrack: true }}
                    defaultValue={priceRangeData.defaultValue} />
            </ConfigProvider>

        </>
    );
}

export default PriceRange