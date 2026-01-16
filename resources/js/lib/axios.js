import axios from 'axios';
import { API_BASE, APP_BASE } from '../config/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 - redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = `${APP_BASE}/login`;
        }
        return Promise.reject(error);
    }
);

export default api;
