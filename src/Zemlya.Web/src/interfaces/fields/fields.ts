export interface IFieldsResponse
{
    id: number;
    name: string;
    cropType: string;
    soilType: string;
    sizeHectares: number;
    latitude: number;
    longitude: number;
    createdAt: Date;
    updatedAt: Date;
    recomendations: string[];
}
export interface IPaginationFieldsResponse
{
    fields: IFieldsResponse[];
    totalCount: number;
}

export interface IFieldsInitialState{
    paginationFieldsResponse: IPaginationFieldsResponse | null;
}