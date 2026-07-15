import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IFieldCreateRequest, IPaginationFieldsResponse, IPatchRequest } from "../../interfaces/fields/fields";
import type { IPagination, IValidationError } from "../../interfaces/general";
import type { AxiosError } from "axios";
import { api } from "../../axios/api";

const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3YTlkNTNhZi0yNzZmLTRjNDgtOTdmMC0zYjM5NmNmODAxNDkiLCJlbWFpbCI6Im5hemFyQGdtYWlsLmNvbSIsInJvbGUiOiJPd25lciIsInRlbmFudElkIjoiMGVmN2I1YjgtYzg1My00MDdlLTg2MDQtYTJjZjA4MzA1YTAwIiwibmJmIjoxNzg0MTE0Nzk0LCJleHAiOjE3ODQxMTY1OTQsImlzcyI6InplbWx5YS1hcGkiLCJhdWQiOiJ6ZW1seWEtY2xpZW50In0.1cdd0AW3ShZlxXGnI073uNFpqY_j8Av7WHdFVre354I";
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


export const getFieldsAsync = createAsyncThunk<IPaginationFieldsResponse, IPagination, { rejectValue: IValidationError }>
    (
        "fields/get-fields-async",
        async (pagination, { rejectWithValue }) => {
            try {
                const response = await api.get(`${import.meta.env.VITE_BASE_URL}/api/fields`, { headers: { Authorization: `Bearer ${jwt}` }, params: pagination });

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
export const createFieldAsync = createAsyncThunk<void, IFieldCreateRequest, { rejectValue: IValidationError }>(
    "fields/create-field-async",
    async (fieldData, { rejectWithValue }) => {
        try {
            await api.post(`${import.meta.env.VITE_BASE_URL}/api/fields`, fieldData, { headers: { Authorization: `Bearer ${jwt}` } });
        } catch (err: any) {
            const error: AxiosError<IValidationError> = err;

            if (!error.response) throw err;
            return rejectWithValue(ConvertError(error));
        }
    }
)
export const archiveFieldAsync = createAsyncThunk<void, string, { rejectValue: IValidationError }>(
    "fields/archive-field-async",
    async (id, { rejectWithValue }) => {
        try {
            await api.patch(`${import.meta.env.VITE_BASE_URL}/api/fields/${id}/archive`, {}, { headers: { Authorization: `Bearer ${jwt}` } });
        } catch (err: any) {
            const error: AxiosError<IValidationError> = err;

            if (!error.response) throw err;
            return rejectWithValue(ConvertError(error));
        }
    }
)
export const unarchiveFieldAsync = createAsyncThunk<void, string, { rejectValue: IValidationError }>(
    "fields/unarchive-field-async",
    async (id, { rejectWithValue }) => {
        try {
            await api.patch(`${import.meta.env.VITE_BASE_URL}/api/fields/${id}/unarchive`, {}, { headers: { Authorization: `Bearer ${jwt}` } });
        } catch (err: any) {
            const error: AxiosError<IValidationError> = err;

            if (!error.response) throw err;
            return rejectWithValue(ConvertError(error));
        }
    }
)
export const removeFieldAsync = createAsyncThunk<void, string, { rejectValue: IValidationError }>(
    "fields/remove-field-async",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${import.meta.env.VITE_BASE_URL}/api/fields/${id}`, { headers: { Authorization: `Bearer ${jwt}` } });
        } catch (err: any) {
            const error: AxiosError<IValidationError> = err;

            if (!error.response) throw err;
            return rejectWithValue(ConvertError(error));
        }
    }
)
export const editFieldAsync = createAsyncThunk<void, IPatchRequest, { rejectValue: IValidationError }>(
    "fields/edit-field-async",
    async (patchData, { rejectWithValue }) => {
        try {
            await api.patch(`${import.meta.env.VITE_BASE_URL}/api/fields/${patchData.id}`,
                patchData.patchOperations,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`
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