import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IFieldCreateRequest, IPaginationFieldsResponse, IPatchRequest } from "../../interfaces/fields/fields";
import type { IPagination, IValidationError } from "../../interfaces/general";
import type { AxiosError } from "axios";
import { api } from "../../axios/api";

function ConvertError(error: AxiosError<IValidationError>) {
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


export const getFieldsAsync = createAsyncThunk<IPaginationFieldsResponse, {pagination : IPagination, token : string}, { rejectValue: IValidationError }>
    (
        "fields/get-fields-async",
        async (data, { rejectWithValue }) => {
            try {
                const response = await api.get(`${import.meta.env.VITE_BASE_URL}/api/fields`, { headers: { Authorization: `Bearer ${data.token}` }, params: data.pagination });

                return response.data;
            } catch (err: any) {
                const error: AxiosError<IValidationError> = err;

                if (!error.response) throw err;
                return rejectWithValue(ConvertError(error));
            }
        }
    )
export const getOblastAsync = createAsyncThunk<string | null, { lat: number, lng: number }, { rejectValue: IValidationError }>(
    "fields/get-oblast-async",
    async (coords, { rejectWithValue }) => {
        try {
            const response = await api.get(`https://nominatim.openstreetmap.org/reverse`, {
                params: {
                    lat: coords.lat,
                    lon: coords.lng,
                    format: "json"
                }
            });
            if (!response.data.address.state) {
                return null;
            }
            return response.data.address.state;
        } catch (err: any) {
            const error: AxiosError<IValidationError> = err;

            if (!error.response) throw err;
            return rejectWithValue(ConvertError(error));
        }
    }
)
export const createFieldAsync = createAsyncThunk<void, {fieldData : IFieldCreateRequest, token : string}, { rejectValue: IValidationError }>(
    "fields/create-field-async",
    async (data, { rejectWithValue }) => {
        try {
            await api.post(`${import.meta.env.VITE_BASE_URL}/api/fields`, data.fieldData, { headers: { Authorization: `Bearer ${data.token}` } });
        } catch (err: any) {
            const error: AxiosError<IValidationError> = err;

            if (!error.response) throw err;
            return rejectWithValue(ConvertError(error));
        }
    }
)
export const archiveFieldAsync = createAsyncThunk<void, {id : string, token : string}, { rejectValue: IValidationError }>(
    "fields/archive-field-async",
    async (data, { rejectWithValue }) => {
        try {
            await api.patch(`${import.meta.env.VITE_BASE_URL}/api/fields/${data.id}/archive`, {}, { headers: { Authorization: `Bearer ${data.token}` } });
        } catch (err: any) {
            const error: AxiosError<IValidationError> = err;

            if (!error.response) throw err;
            return rejectWithValue(ConvertError(error));
        }
    }
)
export const unarchiveFieldAsync = createAsyncThunk<void, {id : string, token : string}, { rejectValue: IValidationError }>(
    "fields/unarchive-field-async",
    async (data, { rejectWithValue }) => {
        try {
            await api.patch(`${import.meta.env.VITE_BASE_URL}/api/fields/${data.id}/unarchive`, {}, { headers: { Authorization: `Bearer ${data.token}` } });
        } catch (err: any) {
            const error: AxiosError<IValidationError> = err;

            if (!error.response) throw err;
            return rejectWithValue(ConvertError(error));
        }
    }
)
export const removeFieldAsync = createAsyncThunk<void, {id : string, token : string}, { rejectValue: IValidationError }>(
    "fields/remove-field-async",
    async (data, { rejectWithValue }) => {
        try {
            await api.delete(`${import.meta.env.VITE_BASE_URL}/api/fields/${data.id}`, { headers: { Authorization: `Bearer ${data.token}` } });
        } catch (err: any) {
            const error: AxiosError<IValidationError> = err;

            if (!error.response) throw err;
            return rejectWithValue(ConvertError(error));
        }
    }
)
export const editFieldAsync = createAsyncThunk<void, {patchData : IPatchRequest, token : string}, { rejectValue: IValidationError }>(
    "fields/edit-field-async",
    async (data, { rejectWithValue }) => {
        try {
            await api.patch(`${import.meta.env.VITE_BASE_URL}/api/fields/${data.patchData.id}`,
                data.patchData.patchOperations,
                {
                    headers: {
                        Authorization: `Bearer ${data.token}`
                    }
                }
            );
        } catch (err: any) {
            const error: AxiosError<IValidationError> = err;

            if (!error.response) throw err;
            return rejectWithValue(ConvertError(error));
        }
    }
)