import axios from "axios"

const baseUrl = "http://localhost"


async function apiGet(url, options = {}) {
    try {
        const opt = getCommonOptions()
        const response = await axios.get(`${baseUrl}/api/v1/${url}`, opt)
        return response
    } catch (e) {
        throw e
    }
}

async function apiPost(context, url, params, options = {}) {
    try {
        const opt = getCommonOptions()
        const response = await axios.post(`${url}/api/v1/${url}`, params, Object.assign(opt, options))
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
    }
}

export default HotelBookingApi