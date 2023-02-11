import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  username: "",
  status: "",
  room: "",
  isConnected: false,
  isConnecting: false,
  nickname: ""
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.status = action.payload.status;
      state.room = action.payload.room;
    },
    unsetUser: (state) => {
      state.username = "";
      state.status = "";
      state.room = "";
      state.isConnected = false;
    },
    connectionEstablished: (state) => {
      state.isConnected = true;
    },
    startConnecting: (state) => {
      state.isConnecting = true;
    },
    updateUser: (state, action) => {
      console.log("dispatch updateUser");
      return;
    },
    setNickname: (state, action) => {
      console.log("dispatch setNickname");
      state.nickname = action.payload.nickname;
    },
    unsetNickname: (state, action) => {
      state.nickname = "";
    },
    updateStatus: (state, action) => {
      state.status = action.payload.status;
    },
    unsetConnection: (state, action) => {
      state.isConnected = false;
      state.isConnecting = false;
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  setUser,
  unsetUser, 
  connectionEstablished,
  startConnecting,
  setNickname,
  updateUser,
  unsetNickname,
  updateStatus,
  unsetConnection
} = userSlice.actions;

export default userSlice.reducer;

export const selectCurrentUsername = (state) => state.user.username;
export const selectCurrentStatus = (state) => state.user.status;
export const selectCurrentRoom = (state) => state.user.room;
export const selectCurrentIsConnected = (state) => state.user.isConnected;
export const selectCurrentNickname = (state) => state.user.nickname;