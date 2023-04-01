export const API_URL = 'http://localhost:8000/api';
export const API_URL_BASE = 'http://localhost:8000';

const headers = new Headers();

headers.append('Content-Type', 'application/json');

export const addAuthToken = (token: string) => {
    headers.append('Authorization', `Bearer ${token}`);
}

export const removeAuthToken = () => {
    headers.delete('Authorization');
}

export const fetchApi = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_URL}${url}`, {
        headers,
        ...options
    });
    return response.json();
}
