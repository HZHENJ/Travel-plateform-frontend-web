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
