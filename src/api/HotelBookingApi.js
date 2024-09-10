import axios from "axios"

const baseUrl = "http://localhost"


async function apiGet(url, options = {}) {
    try {
        const opt = getCommonOptions()
        const response = await axios.get(`${baseUrl}/api/v1/${url}`, Object.assign(opt, options))
        return response
    } catch (e) {
        throw e
    }
}

async function apiPost(url, options = {}) {
    try {
        const opt = getCommonOptions()
        const response = await axios.post(`${baseUrl}/api/v1/${url}`, options, opt)
        return response
    } catch (e) {
        throw e
    }
}

export async function apiPatch(url, options = {}) {
    try {
        const opt = getCommonOptions()
        const response = await axios.patch(`${baseUrl}/api/v1/${url}`, options, opt)
        return response
    } catch (e) {
        throw e
    }
}

const getCommonOptions = () => {
    const headers = {}
    const token = localStorage.getItem("access_token");
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
        // headers.client = authInfo.client
        // headers.uid = authInfo.uid
    }
    return { headers }
}

const getPostFileOptions = () => {
    const headers = {}
    const token = localStorage.getItem("access_token");
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
        headers['Content-Type'] = `multipart/form-data`
        // headers.client = authInfo.client
        // headers.uid = authInfo.uid
    }
    return { headers }
}


const HotelBookingApi = {
    getAllRoom: (payload = {}) => {
        return apiGet(`room-type/`, payload)
    },
    getRoom: (id, payload = {}) => {
        return apiGet(`room-type/${id}?checkin_at=${payload['checkin_at']}&checkout_at=${payload['checkout_at']}`, payload)
    },
    checkoutRoom: (payload = {}) => {
        return apiPost(`checkout?XDEBUG_SESSION_START=16041`, payload)
    },
    cancelBooking: (id, payload = {}) => {
        return apiPatch(`user/${id}/bookings/${payload.id}`, payload)
    },
    getBookingInfo: (id, payload = {}) => {
        return apiGet(`user/${id}/bookings/`, payload)
    },
    getUserInfo: (id, payload = {}) => {
        return apiGet(`user/${id}`, payload)
    },
    updateUser: (id, payload = {}) => {
        return apiPatch(`user/${id}`, payload)
    },
    login: (payload = {}) => {
        return apiPost(`auth/login`, payload)
    },
    logout: (payload = {}) => {
        return apiPost(`auth/logout`, payload)
    },
    forgotPassword: (payload = {}) => {
        return apiPost(`auth/forgot-password`, payload)
    },
    changePassword: (payload = {}) => {
        return apiPost(`auth/change-password`, payload)
    },
    reLogin: (payload = {}) => {
        return apiPost(`auth/me`, payload)
    },
    register: (payload = {}) => {
        return apiPost(`auth/register?XDEBUG_SESSION_START=10557`, payload)
    },
    getUserProfile: (payload = {}) => {
        return apiPost(`auth/me`, payload)
    }
}

export default HotelBookingApi