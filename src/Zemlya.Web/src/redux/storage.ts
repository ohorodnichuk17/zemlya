import { combineReducers, configureStore } from "@reduxjs/toolkit";

const reducers = combineReducers({});
export const storage = configureStore({
    reducer: reducers,
});

export type RootState = ReturnType<typeof storage.getState>;
export type AppDispatch = typeof storage.dispatch;