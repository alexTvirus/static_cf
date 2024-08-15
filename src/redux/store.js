import { configureStore } from '@reduxjs/toolkit'
import { taskReducer } from './features/task/taskSlice'
import { sidebarReducer } from './features/sidebar/sidebarSlice'

export const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
        task: taskReducer
    }
})


