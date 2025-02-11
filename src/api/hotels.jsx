import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const CONTENT_LANGUAGE = import.meta.env.VITE_CONTENT_LANGUAGE;

// fetch all hotels data from api
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
    console.error("fetchHotels", error);
    throw error;
  }
};

// fetch hotel by uuid
export const fetchHotelsByUUID = async(uuid) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/content/accommodation/v2/search`, {
        params: {
          searchType: "uuids",
          searchValues: uuid
        }, 
        headers: {
          "X-API-Key": API_KEY,
          "X-Content-Language": CONTENT_LANGUAGE,
        },
      }
    )
    return response.data;
  } catch (error) {
    console.error("fetchHotelsByUUID", error);
    throw error;
  }
};

// booking
export const sendHotelBookingToBackEnd = async (hotelBooking) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/hotels/booking`, hotelBooking, {
      headers: { "Content-Type": "application/json" }
    });
    return response;
  } catch (error) {
    console.error("Error Booking Hotel:", error.response ? error.response.data : error.message);
  }
}