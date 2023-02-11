import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    conversation: "",
    selectedNickname: "",
    messageList: []
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: initialState,
  reducers: {
    setConversation: (state, action) => {
      state.conversation = action.payload.conversation;
      state.selectedNickname = action.payload.selectedNickname;
      state.messageList = action.payload.messageList;
    },
    unsetConversation: (state, action) => {
      state.conversation = "";
      state.selectedNickname = "";
      state.messageList = [];
    },
    setReceiver: (state, action) => {
      state.selectedNickname = action.payload.selectedNickname;
    },
    submitMessage: (state, action) => {
      let list = [...state.messageList, action.payload];
      state.messageList = list;
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  setConversation,
  unsetConversation,
  setReceiver,
  submitMessage
} = messagesSlice.actions;

export default messagesSlice.reducer;

export const selectCurrentConversation = (state) => state.messages.conversation;
export const selectCurrentMessageList = (state) => state.messages.messageList;
export const selectCurrentReceiver = (state) => state.messages.selectedNickname;