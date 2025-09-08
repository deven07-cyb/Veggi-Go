export interface Contact {
    id: string;
    name: string;
    email: string;
    title: string;
    description: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    emailAddress:string;
}

export interface ContactResponse {
    contactRequests: Contact[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}