import { configureStore } from '@reduxjs/toolkit'; // 17.7k (gxipped: 6.3k)

// Reducers
import userReducer from '../reducers/user/userSlice.js';
import messagesReducer from '../reducers/messages/messagesSlice.js';
import roomReducer from '../reducers/room/roomSlice.js';

import chatMiddleware from '../reducers/user/chatMiddleware.js';

export default configureStore({
    reducer: {
        user: userReducer,
        messages: messagesReducer,
        room: roomReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(chatMiddleware),
    devTools: true
})