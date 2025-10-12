import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./coursesSlice";
import lessonsReducer from "./lessonsSlice";

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    lessons: lessonsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
