export interface Business {
  id: string;
  name: string;
  emailAddress: string;
  status: boolean;
  createsAt: string;
  userImage?: string;
  contactPersonName?: string;
  workEmail?: string;
  birthDate?: string;
  gender?: string;
}


export interface BusinessExport {
  id: string;
  name: string;
  emailAddress: string;
  status: boolean;
  createsAt: Date; 
  userImage?: string;
  gender?: string;
  countryData?: {
    name: string;
  };
}
export interface BusinessUserResponse {
    business: Business[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}