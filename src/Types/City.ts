export interface City {
  id: string;
  name: string;
  stateId: string;
  status: boolean;
  createsAt: Date;
  updatedAt: Date;
  stateKey?: {
    id: string;
    name: string;
  };
}

export interface CityResponse {
    items: City[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}