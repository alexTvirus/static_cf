import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { message } from 'antd'
import HotelBookingApi from '../../../api/HotelBookingApi'
import Util from '../../../utils/util'

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { number } from 'yup';
dayjs.extend(customParseFormat);


const initialState = {
    rooms: [],
    currentRoom: {},
    isLoading: false,
    booking: {
        packets: [

        ],
        room: {
            // id
        },
        guests: 1,
        checkin_at: "",
        checkout_at: "",
        payment: {
            "payment_method": "face pay",
            "payment_date": "",
            "payment_amount": 0,
            "address": "",
            "email": "",
            "city": "",
            "post_code": "",
            "state": ""
        },
    },
    userBookingsData: {

    },
    resultBooking: {
        status: 0
    },
    dateRange: [
        dayjs(), dayjs()
    ],
    pagination: {
        defaultPage: 1,
        defaultPerPage: 5,
        currentPage: 1,
        perPage: 5,
        totalPages: 0,
    }
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

export const actionGetRoom = createAsyncThunk(
    "room/actionGetRoom",
    async (payload, thunkApi) => {
        try {
            return await HotelBookingApi.getRoom(payload.id, payload)
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

export const actionBookingInfo = createAsyncThunk(
    "room/actionBookingInfo",
    async (payload, thunkApi) => {
        try {
            // todo : fake id customer = 1 , sau nay dung user login
            return await HotelBookingApi.getBookingInfo(1,payload)
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

export const actionCheckout = createAsyncThunk(
    "room/actionCheckout",
    async (payload, thunkApi) => {
        try {
            let booking = { ...payload }
            let packets = booking.packets.map((packet) => {
                return { id: packet.id }
            })
            booking.packets = packets
            return await HotelBookingApi.checkoutRoom(booking)
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)


const handleError = (e) => {

    if (e.response && e.response.status === 401) {
        localStorage.removeItem('access_token')
        //   context.app.router.push({ path: '/login' })
    }
}

const roomSlice = createSlice({
    name: "room",
    initialState: initialState,
    reducers: {
        actionSetDateRange: (state, actions) => {
            state.dateRange = actions.payload
        },
        actionSetBooking: (state, actions) => {
            state.booking = actions.payload
        }

        ,
        actionClearBooking: (state, actions) => {
            state.booking = {
                packets: [
                ],
                room: {
                },
                guests: 1,
                checkin_at: "",
                checkout_at: "",
                payment: {
                },
            }
        }
        ,
        actionSetResultBooking: (state, actions) => {
            state.resultBooking = actions.payload
        }
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

            .addCase(actionGetRoom.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(actionGetRoom.fulfilled, (state, action) => {
                state.isLoading = false
                state.currentRoom = action.payload.data.data
            })
            .addCase(actionGetRoom.rejected, (state, action) => {
                state.isLoading = false
                handleError(action.payload)
            })

            .addCase(actionCheckout.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(actionCheckout.fulfilled, (state, action) => {
                state.isLoading = false
                state.resultBooking = action.payload.data.data
                message.success("Checkout Success")
            })
            .addCase(actionCheckout.rejected, (state, action) => {
                debugger
                state.isLoading = false
                handleError(action.payload)
                state.resultBooking = action.payload.response.data.data
                message.error("Checkout Fail")
            })

            .addCase(actionBookingInfo.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(actionBookingInfo.fulfilled, (state, action) => {
                state.isLoading = false
                state.userBookingsData = action.payload.data.data
            })
            .addCase(actionBookingInfo.rejected, (state, action) => {
                state.isLoading = false
                handleError(action.payload)
                message.error("error")
            })

    }
})

export const { actionSetDateRange, actionSetBooking, actionSetResultBooking, actionClearBooking } = roomSlice.actions

// xuất ra reducer
export const roomReducer = roomSlice.reducer