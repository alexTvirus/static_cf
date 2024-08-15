import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    id: 1
}



const sidebarSlice = createSlice({
    name: "sidebar",
    initialState: initialState,
    reducers: {
        setIdSideBar: (state, actions) => {
            state.id = actions.payload
        }
    },
})

export const {setIdSideBar} = sidebarSlice.actions
// xuất ra reducer
export const sidebarReducer = sidebarSlice.reducer