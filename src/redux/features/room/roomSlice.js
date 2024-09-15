import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { message } from 'antd'
import HotelBookingApi from '../../../api/HotelBookingApi'
import {ServiceApi} from '../../../api/ServiceApi'
import Util from '../../../utils/util'
import {RATING_MESSAGES} from '../../../utils/constants'


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
    tempBooking:{},
    userBookingsData: {

    },
	responseData:{
		
	},
	
    resultBooking: {
        status: 0
    },
    dateRange: [
        null, null
    ],
    pagination: {
        defaultPage: 1,
        defaultPerPage: 5,
        currentPage: 1,
        perPage: 5,
        totalPages: 0,
    },
    cities:[],
    districs:[],
    packets:[],
    ratings:[],
    ratingLoading:false
}


export const actionGetAllCities = createAsyncThunk(
    "room/actionGetAllCities",
    async (payload, thunkApi) => {
        try {
            return await ServiceApi.getAllCities(payload)
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

export const actionGetRating = createAsyncThunk(
    "room/actionGetRating",
    async (payload, thunkApi) => {
        try {
            return await HotelBookingApi.getRatingRoom(payload.room,payload.packet,payload)
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

export const actionGetDistrics = createAsyncThunk(
    "room/actionGetDistrics",
    async (payload, thunkApi) => {
        try {
            return await ServiceApi.getDistrics(payload)
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

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

export const actionGetTour = createAsyncThunk(
    "room/actionGetTour",
    async (payload, thunkApi) => {
        try {
            return await HotelBookingApi.getTour(payload.id,payload.packet_id, payload)
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

export const actionGetAllPackets = createAsyncThunk(
    "room/actionGetAllPackets",
    async (payload, thunkApi) => {
        try {
            return await HotelBookingApi.getPackets()
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

export const actionBookingInfo = createAsyncThunk(
    "room/actionBookingInfo",
    async (payload, thunkApi) => {
        try {
            return await HotelBookingApi.getBookingInfo(payload)
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

export const actionCancelBooking = createAsyncThunk(
    "room/actionCancelBooking",
    async (payload, thunkApi) => {
        try {
            return await HotelBookingApi.cancelBooking(1,payload)
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)


export const actionRating = createAsyncThunk(
    "room/actionRating",
    async (payload, thunkApi) => {
        try {
            return await HotelBookingApi.ratingRoom(payload)
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

const handleError = (e) => {
    let error = e?.response?.data?.errors
    if(error)
        message.error(error)
    if (e?.response && e?.response?.status === 401) {
        localStorage.removeItem('access_token')
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
        },
        actionSetTempBooking: (state, actions) => {
            state.tempBooking = actions.payload
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

            .addCase(actionGetAllPackets.pending, (state, action) => {
                // state.isLoading = true
            })
            .addCase(actionGetAllPackets.fulfilled, (state, action) => {
                // state.isLoading = false
                state.packets = action.payload.data.data
            })
            .addCase(actionGetAllPackets.rejected, (state, action) => {
                // state.isLoading = false
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

            .addCase(actionGetTour.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(actionGetTour.fulfilled, (state, action) => {
                state.isLoading = false
                state.currentRoom = action.payload.data.data
            })
            .addCase(actionGetTour.rejected, (state, action) => {
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
			
			.addCase(actionCancelBooking.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(actionCancelBooking.fulfilled, (state, action) => {
                state.isLoading = false
                state.responseData = action.payload.data.data
                message.success("CancelBooking Success")
            })
            .addCase(actionCancelBooking.rejected, (state, action) => {
                state.isLoading = false
                handleError(action.payload)
                state.responseData = action.payload.response.data.data
                message.error("CancelBooking Fail")
            })

            .addCase(actionGetAllCities.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(actionGetAllCities.fulfilled, (state, action) => {
                state.isLoading = false
                state.cities = action.payload.data
            })
            .addCase(actionGetAllCities.rejected, (state, action) => {
                state.isLoading = false
                handleError(action.payload)
            })

            .addCase(actionGetDistrics.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(actionGetDistrics.fulfilled, (state, action) => {
                state.isLoading = false
                state.districs = action.payload.data.districts
            })
            .addCase(actionGetDistrics.rejected, (state, action) => {
                state.isLoading = false
                handleError(action.payload)
            })

            .addCase(actionRating.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(actionRating.fulfilled, (state, action) => {
                state.isLoading = false
                message.success(RATING_MESSAGES.SUCCESS)
            })
            .addCase(actionRating.rejected, (state, action) => {
                state.isLoading = false
                handleError(action.payload)
            })

            .addCase(actionGetRating.pending, (state, action) => {
                state.ratingLoading = true
            })
            .addCase(actionGetRating.fulfilled, (state, action) => {
				debugger
                state.ratingLoading = false
                state.ratings = action?.payload?.data||[]
            })
            .addCase(actionGetRating.rejected, (state, action) => {
                state.ratingLoading = false
                handleError(action.payload)
            })

    }
})

export const { actionSetTempBooking,actionSetDateRange, actionSetBooking, actionSetResultBooking, actionClearBooking } = roomSlice.actions

// xuất ra reducer
export const roomReducer = roomSlice.reducer