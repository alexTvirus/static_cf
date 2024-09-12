export const history = {
    navigate: null,
    location: null,
    params: null,
    getSearchParams: (searchParams) => {
        let rs = {}
        for (let entry of searchParams.entries()) {
            rs = { ...rs, [`${entry[0]}`]: entry[1] }
        }
        return rs
    }
};