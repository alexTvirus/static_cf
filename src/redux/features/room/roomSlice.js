import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { message } from 'antd'
import HotelBookingApi from '../../../api/HotelBookingApi'
import Util from '../../../utils/util'

const initialState = {
    rooms: [],
    isLoading: false,
}

export const actionGetAllRoom = createAsyncThunk(
    "room/actionGetAllRoom",
    async (payload, thunkApi) => {
        try {
            return await HotelBookingApi.getAllRoom(payload)
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)


const handleError = (e) => {
    message.error(e)
    if (e.response && e.response.status === 401) {
        localStorage.removeItem('access_token')
        //   context.app.router.push({ path: '/login' })
    }
}

const roomSlice = createSlice({
    name: "room",
    initialState: initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(actionGetAllRoom.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(actionGetAllRoom.fulfilled, (state, action) => {
                state.isLoading = false
                state.rooms = action.payload.data.data
            })
            .addCase(actionGetAllRoom.rejected, (state, action) => {
                state.isLoading = false
                handleError(action.payload)
            })

    }
})


// xuất ra reducer
export const roomReducer = roomSlice.reducer