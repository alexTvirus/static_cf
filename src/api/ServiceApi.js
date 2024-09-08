import axios from "axios"

const baseUrl = "https://provinces.open-api.vn/api"

export const ServiceApi = {
    getAllCities: async (options = {}) => {
        try {
            const response = await axios.get(`${baseUrl}/p/`, options)
            return response
        } catch (e) {
            throw e
        }
    },
    getDistrics: async (cityId,options = {}) => {
        try {
            const response = await axios.get(`${baseUrl}/p/${cityId}?depth=2`, options)
            return response
        } catch (e) {
            throw e
        }
    }
}