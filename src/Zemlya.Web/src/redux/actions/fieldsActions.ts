import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IPaginationFieldsResponse } from "../../interfaces/fields/fields";
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