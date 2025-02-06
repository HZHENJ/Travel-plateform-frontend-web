import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const submitReview = async (reviewData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/reviews`, reviewData);
    return response.data;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

export const checkUserReview = async (userId, itemId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/reviews/check?userId=${userId}&itemId=${itemId}`);
    return response.data.exists; // 返回 `true` 或 `false`
  } catch (error) {
    console.error("Error checking review:", error);
    return false; // 默认未评论
  }
};

