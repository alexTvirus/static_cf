import JsonApi from "../api/jsonServer";


const listStatus = [
    {
        id: 1,
        name: "new",
        className: "status-new"
    },

    {
        id: 2,
        name: "doing",
        className: "status-doing"
    },
    {
        id: 3,
        name: "done",
        className: "status-done"
    }
]

const listChooseSearch = [
    {
        id: 1,
        name: "title",
    },

    {
        id: 2,
        name: "createBy",
    },
]

const Util = {
    getlistChooseSearch: () => {
        return listChooseSearch
    }
    ,
    getListStatus: () => {
        return listStatus
    }
    ,
    getObjectStatus: (id) => {
        return listStatus.find(item => {
            return item.id === id
        })
    },
    getSearchParams: (searchParams) => {
        let rs = {}
        for (let entry of searchParams.entries()) {
            rs = { ...rs, [`${entry[0]}`]: entry[1] }
        }
        return rs
    },
    debounce: () => {
        let timer = null
        return (time, callback) => {
            if (timer) {
                clearTimeout(timer)
                timer = null
            }
            timer = setTimeout(() => {
                callback()
            }, time);
        }
    },
    isObjectEmpty: (object) => {
        for (let o in object)
            return false
        return true
    },
    genId: async () => {
        let rsp = await JsonApi.getAllTasks("")
        let array = new Uint32Array(1);
        let randomNumber = null;
        let randomSixDigitString = null;
        let check = true
        while (check) {

            window.crypto.getRandomValues(array);
            randomNumber = array[0] % 1000000;
            randomSixDigitString = randomNumber.toString().padEnd(6, '0');
            check = rsp.data.some((item) => {
                return item.id === randomSixDigitString
            })
        }
        return randomSixDigitString;
    }

}

export default Util