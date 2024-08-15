import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { message } from 'antd'
import JsonApi from '../../../api/jsonServer'
import Util from '../../../util/util'

const initialState = {
    tasks: [],
    isLoading: false,
    currentTask: {},
    pagination: {
        defaultPage: 1,
        defaultPerPage: 5,
        currentPage: 1,
        perPage: 5,
        totalData: 0,
        searchKey: {}
    }
}

export const actionFetchAllTask = createAsyncThunk(
    "task/actionFetchAllTask",
    async (payload, thunkApi) => {
        try {
            debugger
            return await JsonApi.getAllTasks(payload)
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)


export const actionFetchTaskById = createAsyncThunk(
    "task/actionFetchTaskById",
    async (payload, thunkApi) => {
        try {
            return await JsonApi.getTask(payload)
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

export const actionAddTask = createAsyncThunk(
    "task/actionAddTask",
    async (payload, thunkApi) => {
        try {
            return await JsonApi.addTask(payload)
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

export const actionDeleteTask = createAsyncThunk(
    "task/actionDeleteTask",
    async (payload, thunkApi) => {
        try {
            return await JsonApi.deleteTask(payload)
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

export const actionUpdateTask = createAsyncThunk(
    "task/actionUpdateTask",
    async (payload, thunkApi) => {
        try {
            return await JsonApi.updateTask(payload.id, payload)
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

const taskSlice = createSlice({
    name: "task",
    initialState: initialState,
    reducers: {
        resetCurrentTask: (state, actions) => {
            state.currentTask = {}
        },
        actionSetPagination: (state, actions) => {
            actions.payload.currentPage && (state.pagination.currentPage = actions.payload.currentPage)
            actions.payload.perPage && (state.pagination.perPage = actions.payload.perPage)
        },
        actionSetCurrentTask: (state, actions) => {
            state.currentTask = actions.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(actionFetchAllTask.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(actionFetchAllTask.fulfilled, (state, action) => {
                state.isLoading = false
                state.tasks = action.payload.data
                state.pagination.totalData = action.payload.items
            })
            .addCase(actionFetchAllTask.rejected, (state, action) => {
                state.isLoading = false
                message.error(action.payload)
            })

            .addCase(actionFetchTaskById.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(actionFetchTaskById.fulfilled, (state, action) => {
                state.isLoading = false
                state.currentTask = action.payload
            })
            .addCase(actionFetchTaskById.rejected, (state, action) => {
                state.isLoading = false
                message.error(action.payload)
            })

            .addCase(actionAddTask.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(actionAddTask.fulfilled, (state, action) => {
                state.isLoading = false
                message.success("add task success")
            })
            .addCase(actionAddTask.rejected, (state, action) => {
                state.isLoading = false
                message.error(action.payload)
            })

            .addCase(actionDeleteTask.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(actionDeleteTask.fulfilled, (state, action) => {
                state.isLoading = false
                message.success("delete task success")
            })
            .addCase(actionDeleteTask.rejected, (state, action) => {
                state.isLoading = false
                message.error(action.payload)
            })

            .addCase(actionUpdateTask.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(actionUpdateTask.fulfilled, (state, action) => {
                state.isLoading = false
                message.success("update task success")
            })
            .addCase(actionUpdateTask.rejected, (state, action) => {
                state.isLoading = false
                message.error(action.payload)
            })
    }
})

export const { resetCurrentTask, actionSetPagination, actionSetCurrentTask } = taskSlice.actions

// xuất ra reducer
export const taskReducer = taskSlice.reducer