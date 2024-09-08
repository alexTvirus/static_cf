import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { message } from 'antd'
import HotelBookingApi from '../../../api/HotelBookingApi'
import Util from '../../../utils/util'
import {REGISTRATION_MESSAGES} from '../../../utils/constants'
import {history} from '../../../routes/helper/history'
import { RouteName } from '../../../routes/RouteName';


import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);


const initialState = {
    isLoading: false,
    isAuth:false,
    currentUser: {},
}


const handleError = (e) => {
    let error = e?.response?.data?.errors
    if(error)
        message.error(error)
    if (e?.response && e?.response?.status === 401) {
        localStorage.removeItem('access_token')
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

export const actionReLogin = createAsyncThunk(
    "auth/actionReLogin",
    async (payload, thunkApi) => {
        try {
            return await HotelBookingApi.reLogin(payload)
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

export const actionGetUserProfile = createAsyncThunk(
    "user/actionGetUserProfile",
    async (payload, thunkApi) => {
        try {
            return await HotelBookingApi.getUserProfile()
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

export const actionUpdateUser = createAsyncThunk(
    "user/actionUpdateUser",
    async (payload, thunkApi) => {
        try {
            return await HotelBookingApi.updateUser(payload.id,payload)
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
            localStorage.setItem('access_token', action.payload.data.data.access_token)
            state.currentUser = action.payload.data.data.userProfile
        })
        .addCase(actionLogin.rejected, (state, action) => {
            state.isLoading = false
            handleError(action.payload)
        })

        .addCase(actionReLogin.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(actionReLogin.fulfilled, (state, action) => {
            state.isLoading = false
            state.isAuth = true
            state.currentUser = action.payload.data.data.userProfile
        })
        .addCase(actionReLogin.rejected, (state, action) => {
            state.isLoading = false
            handleError(action.payload)
        })

        .addCase(actionLogout.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(actionLogout.fulfilled, (state, action) => {
            state.isLoading = false
            state.isAuth = false
            localStorage.removeItem('access_token')
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
            message.success(REGISTRATION_MESSAGES.SUCCESS)
            history.navigate(RouteName.LOGIN.path)
        })
        .addCase(actionRegister.rejected, (state, action) => {
            state.isLoading = false
            handleError(action.payload)
        })

        .addCase(actionGetUserProfile.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(actionGetUserProfile.fulfilled, (state, action) => {
            state.isLoading = false
            state.currentUser = action.payload.data.data
        })
        .addCase(actionGetUserProfile.rejected, (state, action) => {
            state.isLoading = false
            handleError(action.payload)
        })

        .addCase(actionUpdateUser.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(actionUpdateUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.currentUser = action.payload.data.data
        })
        .addCase(actionUpdateUser.rejected, (state, action) => {
            state.isLoading = false
            handleError(action.payload)
        })
    }
})


// xuất ra reducer
export const authReducer = authSlice.reducer