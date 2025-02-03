import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const CONTENT_LANGUAGE = import.meta.env.VITE_CONTENT_LANGUAGE;

export const fetchHotels = async (offset = 0, limit = 6) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/content/common/v2/search`, {
      params: { 
        offset, 
        limit, 
        dataset: "accommodation" 
      },
      headers: {
        "X-API-Key": API_KEY,
        "X-Content-Language": CONTENT_LANGUAGE,
      },
    });
    
    return response;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};