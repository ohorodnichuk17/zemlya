import { createSlice } from "@reduxjs/toolkit";
import type { IFieldsInitialState } from "../../interfaces/fields/fields"
import { getFieldsAsync } from "../actions/fieldsActions";
import type { IValidationError } from "../../interfaces/general";

const initialState : IFieldsInitialState = {
    paginationFieldsResponse: null
}
export const fieldsSlice = createSlice({
    name: 'fields',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getFieldsAsync.fulfilled, (state, action) => {
            state.paginationFieldsResponse = action.payload;
        })
        .addCase(getFieldsAsync.rejected, (state, action) => {
            state.paginationFieldsResponse = null;
            ErrorHandler(action.payload ?? {statusCode: action.error.code ?? 500, message: action.error.message ?? "Unknown error"} as IValidationError);
        });
    }
});

function ErrorHandler(error : IValidationError){
    console.error(`Error ${error.statusCode}: ${error.message}`);         
}

export const fieldsReducer = fieldsSlice.reducer;