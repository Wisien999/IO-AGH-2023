export const API_URL = 'http://localhost:8000';

export const fetchApi = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_URL}${url}`, options);
    return response.json();
}
