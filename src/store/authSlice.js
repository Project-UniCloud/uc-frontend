import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    role: null, // 'admin', 'lecturer', 'student', etc.
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user || action.payload;
      state.role = action.payload.role || null;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
