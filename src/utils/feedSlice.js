import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },

    appendFeed: (state, action) => {
      if (!Array.isArray(state)) return action.payload;
      if (!Array.isArray(action.payload)) return state;

      const existingIds = new Set(state.map((user) => user._id));
      const newUsers = action.payload.filter(
        (user) => !existingIds.has(user._id),
      );
      return [...state, ...newUsers];
    },

    removeFeedUser: (state, action) => {
      if (!Array.isArray(state)) return state;

      return state.filter((user) => user._id !== action.payload);
    },
  },
});

export const { addFeed, appendFeed, removeFeedUser } = feedSlice.actions;

export default feedSlice.reducer;
