import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IFieldCreateRequest, IPaginationFieldsResponse } from "../../interfaces/fields/fields";
import type { IPagination, IValidationError } from "../../interfaces/general";
import type { AxiosError } from "axios";
import { api } from "../../axios/api";

function ConvertError(error : AxiosError<IValidationError>){
    const data = error.response!.data;

    const responseData: IValidationError =
        typeof data === "object" && data != null
        ? {
            statusCode: (data as any).StatusCode,
            message: (data as any).Message,
        }
        : {
            statusCode: error.response!.status,
            message: error.response!.statusText,
        } as IValidationError;
    return responseData;
}


export const getFieldsAsync = createAsyncThunk<IPaginationFieldsResponse,IPagination,{rejectValue: IValidationError}>
(
    "fields/get-fields-async",
    async (pagination, { rejectWithValue }) => {
        try {
            const response = await api.get(`${import.meta.env.VITE_BASE_URL}/api/fields`, { params: pagination });

            return response.data;
        }catch (err: any) {
            const error : AxiosError<IValidationError> = err;

            if (!error.response) throw err;
            return rejectWithValue(ConvertError(error));
        }
    }
)
export const getOblastAsync = createAsyncThunk<string | null, {lat: number, lng: number}, { rejectValue: IValidationError }>(
    "fields/get-oblast-async",
    async (coords, { rejectWithValue }) => {
        try {
            const response = await api.get(`https://nominatim.openstreetmap.org/reverse`, { params: {
                lat: coords.lat,
                lon: coords.lng,
                format: "json"
            } });
            if(!response.data.address.state) {
                return null;
            }
            return response.data.address.state;
        } catch (err: any) {
            const error : AxiosError<IValidationError> = err;

            if (!error.response) throw err;
            return rejectWithValue(ConvertError(error));
        }
    }
)
export const createFieldAsync = createAsyncThunk<void, IFieldCreateRequest, { rejectValue: IValidationError }>(
    "fields/create-field-async",
    async (fieldData, { rejectWithValue }) => {
        try {
            await api.post(`${import.meta.env.VITE_BASE_URL}/api/fields`, fieldData);      
        } catch (err: any) {
            const error : AxiosError<IValidationError> = err;

            if (!error.response) throw err;
            return rejectWithValue(ConvertError(error));
        }
    }
)