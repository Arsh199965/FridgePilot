import { API_CONFIG, ERROR_MESSAGES } from '@/constants';

interface ApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
}

export class ApiError extends Error {
    constructor(
        public message: string,
        public status?: number,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export async function apiCall<T>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<T> {
    try {
        const { 
            method = 'GET', 
            body, 
            headers = {},
            credentials = 'include'  // Include credentials by default
        } = options;
        
        const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
            method,
            credentials,
            headers: {
                ...API_CONFIG.headers,
                ...headers
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        // Handle no content responses
        if (response.status === 204) {
            return {} as T;
        }

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            throw new ApiError(
                data.message || ERROR_MESSAGES.SERVER_ERROR,
                response.status,
                data
            );
        }

        return data as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        
        // Handle network errors
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR);
        }
        
        throw new ApiError(
            error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR
        );
    }
} 