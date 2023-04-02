export const API_URL_BASE = process.env.API_URL || 'http://localhost:8000';
export const API_URL = `${API_URL_BASE}/api`;

const headers = new Headers();

headers.append('Content-Type', 'application/json');

export const addAuthToken = (token: string) => {
    headers.append('Authorization', `Bearer ${token}`);
}

export const removeAuthToken = () => {
    headers.delete('Authorization');
}

export const fetchApi = async (url: string, options: RequestInit & { ignoreJSON?: boolean } = {}) => {
    const response = await fetch(`${API_URL}${url}`, {
        headers,
        ...options
    });
    if (options?.ignoreJSON) {
        return response.text();
    }
    return response.json();
}
