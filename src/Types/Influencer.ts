export interface Influencer {
  id: string;
  name: string;
  emailAddress: string;
  status: boolean;
  createsAt: string;
  userImage?: string;
  gender?: string;
  countryData?: {
    name: string;
  };
}
