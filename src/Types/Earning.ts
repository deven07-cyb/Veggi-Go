export interface Earning {
  id: string;
  earningAmount: string;
  paymentStatus: string;
  createdAt: string;
  orderData?: {
    title: string;
  };
}

export interface EarningResponse {
  earnings: Earning[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}




// export interface Earning {
//     id: string;
//     title: string; // Make sure this matches the backend (e.g., title or name)
//     amount: string;
//     status: boolean;
//     createsAt: Date;
//     updatedAt: Date;
// }

// export interface EarningResponse {
//     earnings: Earning[];
//     pagination: {
//         total: number;
//         page: number;
//         limit: number;
//         totalPages: number;
//     };
// }