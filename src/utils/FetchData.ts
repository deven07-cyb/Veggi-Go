import { ApiResponse } from "../Types/ApiResponse";
export async function FetchData<T>(
    endpoint: string,
    method: string = 'POST',
    body?: any,
    headers: HeadersInit = {}
): Promise<ApiResponse<T>> {

    const baseUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('authToken');
    
    const requestOptions: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
            ...headers
        }
    };

    // Only add body for methods that typically have one
    if (body && method !== 'GET') {
        requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, requestOptions);

    if (response.status === 401) {
        localStorage.clear();
        window.location.href = '/';
    }

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
}