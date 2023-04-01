const API_URL = 'localhost:8080';

export const fetchApi = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_URL}${url}`, options);
    return response.json();
}
