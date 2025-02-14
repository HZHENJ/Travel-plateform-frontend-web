import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchPersonalizedRecommendations = async (userId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/recommendations/personalized/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};


export const fetchPopularRecommendations = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/recommendations/famous`);
    return response.data;
  } catch (error) {
    console.error("famous", error);
    return [];
  }
};

// checkIfNewUser
export const checkIfNewUser = async (userId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/auth/${userId}/is-new-attraction-user`);
    return response.data;
  } catch (error) {
    console.error("famous", error);
    return [];
  }
};