export interface IRecommendationResponse {
   id: string;
   actionType: string;
   scheduledFor: string;
   amount: number;
   isCompleted: boolean;
   description: string;
}

export interface IFieldsResponse {
   id: string;
   name: string;
   cropType: string;
   soilType: string;
   sizeHectares: number;
   latitude: number;
   longitude: number;
   oblast: string;
   shellingImpactLevel: string;
   sowingDate: string;
   createdAt: string;
   updatedAt: string;
   recommendations: IRecommendationResponse[];
}
export interface IPaginationFieldsResponse {
   fields: IFieldsResponse[];
   totalCount: number;
}

export interface IFieldsInitialState {
   paginationFieldsResponse: IPaginationFieldsResponse | null;
}
export interface IFieldCreateRequest {
   name: string;
   cropType: number;
   soilType: number;
   sizeHectares: number;
   latitude: number;
   longitude: number;
   oblast: string;
   shellingImpactLevel: number;
   sowingDate: string;
}