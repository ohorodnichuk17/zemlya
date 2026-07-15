import { createSlice } from "@reduxjs/toolkit";
import type { IAuthInitialState } from "../../interfaces/auth";
import { decodeToken } from "../../utils/jwt";
import { registerAsync, loginAsync, logoutAsync } from "../actions/authActions";

const accessToken = localStorage.getItem("accessToken");
const initialUser = accessToken ? decodeToken(accessToken) : null;

const initialState: IAuthInitialState = {
   token: accessToken,
   user: initialUser,
   status: 'idle',
   error: null
};

export const authSlice = createSlice({
   name: 'auth',
   initialState: initialState,
   reducers: {
      setTokens: (state, action) => {
         const { accessToken, refreshToken } = action.payload;
         localStorage.setItem("accessToken", accessToken);
         localStorage.setItem("refreshToken", refreshToken);
         state.token = accessToken;
         state.user = decodeToken(accessToken);
         state.status = 'succeeded';
         state.error = null;
      },
      clearAuth: (state) => {
         localStorage.removeItem("accessToken");
         localStorage.removeItem("refreshToken");
         state.token = null;
         state.user = null;
         state.status = 'idle';
         state.error = null;
      }
   },
   extraReducers: (builder) => {
      builder
         .addCase(registerAsync.pending, (state) => {
            state.status = 'loading';
            state.error = null;
         })
         .addCase(registerAsync.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.token = action.payload.accessToken;
            state.user = decodeToken(action.payload.accessToken);
         })
         .addCase(registerAsync.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload?.errorCode || action.payload?.message || "Registration failed";
         })
         .addCase(loginAsync.pending, (state) => {
            state.status = 'loading';
            state.error = null;
         })
         .addCase(loginAsync.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.token = action.payload.accessToken;
            state.user = decodeToken(action.payload.accessToken);
         })
         .addCase(loginAsync.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload?.errorCode || action.payload?.message || "Login failed";
         })

         .addCase(logoutAsync.fulfilled, (state) => {
            state.token = null;
            state.user = null;
            state.status = 'idle';
            state.error = null;
         });
   }
});

export const { setTokens, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
