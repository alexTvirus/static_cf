import { configureStore } from '@reduxjs/toolkit'
import { roomReducer } from './features/room/roomSlice'
import { authReducer } from './features/auth/authSlice'

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    
} from 'redux-persist'

export const store = configureStore({
    reducer: {
        room: roomReducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
})


