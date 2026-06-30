import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { fieldsReducer } from "./slices/fieldsSlice";

const reducers = combineReducers({
    fieldsReducer: fieldsReducer
});
export const storage = configureStore({
    reducer: reducers,
});

export type RootState = ReturnType<typeof storage.getState>;
export type AppDispatch = typeof storage.dispatch;