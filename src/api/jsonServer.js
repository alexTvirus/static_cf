import axios from "axios"

const url = "http://localhost:5000"

const JsonApi = {

    getAllTasks: async (params={}) => {
        try {
            const rsp = await axios.get(`${url}/tasks`, {
                params: {
                    ...params,
                    _sort:"createAt",
                    _order:"desc"
                }
            })
            if (rsp && rsp.status >= 200 && rsp.status <= 299) {
                let rs = {}
                if(rsp.headers['x-total-count']){
                    rs.items = rsp.headers['x-total-count']
                }else{
                    rs.items = 0
                }
                rs.data = rsp?.data
                return  rs
            }

        } catch (error) {
            console.error(error)
        }
        return null
    },
    getTask: async (params={}) => {
        try {
            const rsp = await axios.get(`${url}/tasks`, {
                params: {
                    ...params
                }
            })
            if (rsp && rsp.status >= 200 && rsp.status <= 299) {
                return  rsp?.data[0]
            }

        } catch (error) {
            console.error(error)
        }
        return null
    },
    deleteTask: async (id) => {
        try {
            await axios.delete(`${url}/tasks/${id}`)
        } catch (error) {
            console.error(error)
        }
    },
    addTask: async (params) => {
        try {
            await axios.post(`${url}/tasks`, params)
        } catch (error) {
            console.error(error)
        }
    },
    updateTask: async (id, params) => {
        try {
            await axios.patch(`${url}/tasks/${id}`, params)
        } catch (error) {
            console.error(error)
        }
    }

}

export default JsonApi