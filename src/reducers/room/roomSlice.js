import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: "",
  users: [],
  nicknames: []
};

export const roomSlice = createSlice({
  name: 'room',
  initialState: initialState,
  reducers: {
    setRoom: (state, action) => {
        console.log("dispatch setRoom");
        state.id = action.payload.id;
        let re = new RegExp("/[\[\]]/g");
        let userList = action.payload.users.toString();
        let newUsers = userList.replace("[", "").replace("]", "").split(",");
        state.users = newUsers;
        //let nicknameList = action.payload.nicknames.toString();
        //let newNicknames = nicknameList.replace("[", "").replace("]", "").split(", ");
        //state.nicknames = newNicknames;
        state.nicknames = action.payload.nicknames;
        
    },
    setNicknames: (state, action) => {
        state.nicknames = action.payload.nicknames;
    },
    unsetRoom: (state) => {
        state.id = "";
        state.users = [];
        state.nicknames = [];
    },
    addUser: (state, action) => {
        state.users.append(action.payload.users);
    },
    resetNotif: (state, action) => {
        return;
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  setRoom,
  setNicknames,
  unsetRoom,
  addUser,
  resetNotif
} = roomSlice.actions;

export default roomSlice.reducer;

export const selectCurrentRoomId = (state) => state.room.id;
export const selectCurrentRoomUsers = (state) => state.room.users;
export const selectCurrentRoomNicknames = (state) => state.room.nicknames;