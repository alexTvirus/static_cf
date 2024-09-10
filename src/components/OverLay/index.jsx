import { RingSpinner, RingSpinnerOverlay } from 'react-spinner-overlay'
import { act } from 'react';

const OverlayComponent = ({isLoading}) => {
    return (<>
        <RingSpinnerOverlay
            color='#074498'
            loading={isLoading}
            message={
                <p style={{ marginTop: "12px" }}>
                    Đang xử lý!
                </p>
            }
        >
        </RingSpinnerOverlay>
    </>)
}

export default OverlayComponent