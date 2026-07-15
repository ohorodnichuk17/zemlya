export interface IValidationError {
    statusCode : number,
    message: string,
    errorCode?: string
}

export interface IPagination{
    isArchived: boolean,
    page: number,
    sizeOfPage: number,
    
} 