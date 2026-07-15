import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { api } from "../../axios/api";
import type { ILoginResponse, IRegisterResponse } from "../../interfaces/auth";
import type { IValidationError } from "../../interfaces/general";

function ConvertError(error: AxiosError<IValidationError>) {
    const data = error.response?.data;
    let errorCode = (data as any)?.errorCode;

    if (errorCode === "validation_error" && (data as any)?.errors && (data as any).errors.length > 0) {
        errorCode = (data as any).errors[0].errorCode;
    }

    const responseData: IValidationError =
        typeof data === "object" && data != null
            ? {
                  statusCode: (data as any).statusCode || error.response!.status,
                  message: (data as any).error || (data as any).message || "Unknown error",
                  errorCode: errorCode,
              }
            : {
                  statusCode: error.response?.status || 500,
                  message: error.response?.statusText || "Unknown error",
              };
    return responseData;
}

export const registerAsync = createAsyncThunk<
    IRegisterResponse,
    any,
    { rejectValue: IValidationError }
>(
    "auth/register-async",
    async (registerData, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/auth/register`, registerData);
            const { accessToken, refreshToken } = response.data;
            
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            
            return response.data;
        } catch (err: any) {
            const error: AxiosError<IValidationError> = err;
            if (!error.response) throw err;
            return rejectWithValue(ConvertError(error));
        }
    }
);

export const loginAsync = createAsyncThunk<
    ILoginResponse,
    any,
    { rejectValue: IValidationError }
>(
    "auth/login-async",
    async (loginData, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/auth/login`, loginData);
            const { accessToken, refreshToken } = response.data;
            
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            
            return response.data;
        } catch (err: any) {
            const error: AxiosError<IValidationError> = err;
            if (!error.response) {
                throw err;
            }
            return rejectWithValue(ConvertError(error));
        }
    }
);

export const logoutAsync = createAsyncThunk<void, void, { rejectValue: IValidationError }>(
    "auth/logout-async",
    async (_, { rejectWithValue }) => {
        try {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        } catch (err: any) {
            return rejectWithValue({ statusCode: 500, message: "Failed to logout" });
        }
    }
);
