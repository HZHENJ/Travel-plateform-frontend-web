import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// register
export const register = async (userData) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/auth/register`, userData);
        return response; // 确保成功时返回 response
    } catch (error) {
        console.error("Register Error:", error.response?.data || error.message);
        throw error;
    } 
};

// login
export const login = async (userData) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/auth/login`, userData)
        return response;
    } catch (error) {
        console.error("Register Error:", error.response?.data || error.message);
        throw error;
    }
}
