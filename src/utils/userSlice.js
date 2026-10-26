import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isRequestSucess: false,
  },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = null;
      state.isRequestSucess = false;
    },
    isRequestSucess: (state, action) => {
      state.isRequestSucess = action.payload;
    },
  },
});

export const { addUser, removeUser, isRequestSucess } = userSlice.actions;

export default userSlice.reducer;
