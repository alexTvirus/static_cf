import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { message } from 'antd'
import HotelBookingApi from '../../../api/HotelBookingApi'
import Util from '../../../utils/util'

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);


const initialState = {
    isLoading: false,
    isAuth:false,
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

export const actionLogin = createAsyncThunk(
    "auth/actionLogin",
    async (payload, thunkApi) => {
        try {
            return await HotelBookingApi.login(payload)
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

export const actionLogout = createAsyncThunk(
    "auth/actionLogout",
    async (payload, thunkApi) => {
        try {
            return await HotelBookingApi.logout()
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

export const actionRegister = createAsyncThunk(
    "auth/actionRegister",
    async (payload, thunkApi) => {
        try {
            return await HotelBookingApi.register(payload)
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
    },
    extraReducers: builder => { 
        builder
        .addCase(actionLogin.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(actionLogin.fulfilled, (state, action) => {
            state.isLoading = false
            state.isAuth = true
            localStorage.setItem('access_token', action.payload.data.access_token)
            state.currentUser = action.payload.data.userProfile
        })
        .addCase(actionLogin.rejected, (state, action) => {
            state.isLoading = false
            handleError(action.payload)
        })

        .addCase(actionLogout.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(actionLogout.fulfilled, (state, action) => {
            state.isLoading = false
            state.isAuth = false
            state.currentUser = {}
        })
        .addCase(actionLogout.rejected, (state, action) => {
            state.isLoading = false
            handleError(action.payload)
        })

        .addCase(actionRegister.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(actionRegister.fulfilled, (state, action) => {
            state.isLoading = false
            state.isAuth = false
        })
        .addCase(actionRegister.rejected, (state, action) => {
            state.isLoading = false
            handleError(action.payload)
        })
    }
})


// xuất ra reducer
export const authReducer = authSlice.reducer