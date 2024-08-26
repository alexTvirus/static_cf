import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { message } from 'antd'
import HotelBookingApi from '../../../api/HotelBookingApi'
import Util from '../../../utils/util'

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);


const initialState = {
    accessToken: "",
    currentUser: {},
}


const handleError = (e) => {
    message.error(e)
    if (e.response && e.response.status === 401) {
        localStorage.removeItem('access_token')
        //   context.app.router.push({ path: '/login' })
    }
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
           
    }
})


// xuất ra reducer
export const authReducer = authSlice.reducer