export interface Order {
  id: string;
  title: string;
  description: string; 
  status: number;
  totalAmount: number;
  compliationDate: string; 
  createdAt: string;
  type: "group" | "influencer"; 
}


export interface OrderResponse {
  orderList: Order[]; 
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}





