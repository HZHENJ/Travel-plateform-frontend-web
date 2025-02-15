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

// 从后端获取用户数据
export const fetchUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/auth/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// 更新用户偏好
export const updateUserPreferences = async (userId, preferences) => {
  try {
    const response = await axios.put(`${BACKEND_URL}/auth/${userId}/preferences`, preferences);
    return response.data;
  } catch (error) {
    console.error("Error updating preferences:", error);
    throw error;
  }
};
