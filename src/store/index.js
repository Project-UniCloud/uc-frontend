import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};
