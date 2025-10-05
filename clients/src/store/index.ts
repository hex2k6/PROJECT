import { configureStore } from "@reduxjs/toolkit";
import courses from "./coursesSlice";

export const store = configureStore({
  reducer: {
    courses,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
