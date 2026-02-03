const API_BASE_URL = "http://localhost:8080/api"; 

const ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    PROFILE: `${API_BASE_URL}/users/profile`,
    CHAT: `${API_BASE_URL}/ai/chat`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    PROFILE: `${API_BASE_URL}/users/profile`,
};