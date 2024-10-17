import axios from "axios"

const baseUrl = "https://esgoo.net/api-tinhthanh"

export const ServiceApi = {
    getAllCities: async (options = {}) => {
        try {
            const response = await axios.get(`${baseUrl}/1/0.htm`, options)
            return response
        } catch (e) {
            throw e
        }
    },
    getDistrics: async (cityId,options = {}) => {
        try {
            const response = await axios.get(`${baseUrl}/2/${cityId}.htm`, options)
            return response
        } catch (e) {
            throw e
        }
    }
}