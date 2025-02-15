import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const CONTENT_LANGUAGE = import.meta.env.VITE_CONTENT_LANGUAGE;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// fetch all hotels data from api
export const fetchHotels = async (offset = 0, limit = 6) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/content/common/v2/search`, {
      params: { 
        offset, 
        limit, 
        dataset: "accommodation",
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
  const searchValues = Array.isArray(uuid) ? uuid.join(",") : uuid;
  try {
    const response = await axios.get(
      `${API_BASE_URL}/content/accommodation/v2/search`, {
        params: {
          searchType: "uuids",
          searchValues: searchValues
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
// {
//   "userId": 1,
//   "uuid": "0013526460d4164465ebd5944feb16279e4",
//   "checkInDate": "2025-03-10",
//   "checkOutDate": "2025-03-15",
//   "roomType": "Deluxe Suite",
//   "guests": 2,
//   "price": 0.00
// }
export const sendHotelBookingToBackEnd = async (hotelBooking) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/hotels/booking`, hotelBooking, {
      headers: { "Content-Type": "application/json" }
    });
    return response;
  } catch (error) {
    console.error("Error Booking Hotel:", error.response ? error.response.data : error.message);
  }
}

export const cancelHotelBooking = async (bookingId) => {
  try {
      const response = await axios.delete(`${BACKEND_URL}/hotels/booking/${bookingId}`);
      return response.data;
  } catch (error) {
      console.error("Error canceling hotel booking:", error);
      throw error;
  }
};

// fetch review & rating from backend
export const fetchReviewRatingByUUID = async(uuid) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/hotels/${uuid}/reviews`)
    return response.data;
  } catch (error) {
    console.error("fetchReviewRatingByUUID", error);
    throw error;
  }
};

export const fetchReviewStatsByUUID = async(uuid) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/reviews/hotel/${uuid}`)
    return response;
  } catch (error) {
    console.error("fetchReviewStatsByUUID", error);
    throw error;
  }
}