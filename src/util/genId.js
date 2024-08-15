import JsonApi from "../api/jsonServer";


const GenID = {
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

export default GenID