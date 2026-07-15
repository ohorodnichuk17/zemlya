import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { fieldsReducer } from "./slices/fieldsSlice";
import { authReducer } from "./slices/authSlice";

const reducers = combineReducers({
    fieldsReducer: fieldsReducer,
    authReducer: authReducer
});
export const storage = configureStore({
    reducer: reducers,
});

export type RootState = ReturnType<typeof storage.getState>;
export type AppDispatch = typeof storage.dispatch;