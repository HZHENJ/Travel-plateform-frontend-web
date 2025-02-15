import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const CONTENT_LANGUAGE = import.meta.env.VITE_CONTENT_LANGUAGE;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// fetch all Attractions data from api
export const fetchAttraction = async (offset = 0, limit = 6) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/content/common/v2/search`, {
        params: { 
          offset, 
          limit, 
          dataset: "attractions" 
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

export const fetchAttractionByKeyword = async (searchValues = "", offset = 0, limit = 6) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/content/attractions/v2/search`, {
      params: { 
        searchType: "keyword",
        searchValues: searchValues,
        offset, 
        limit, 
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

// fetch attraction by uuid
export const fetchAttractoionsByUUID = async(uuid) => {
    const searchValues = Array.isArray(uuid) ? uuid.join(",") : uuid;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/content/attractions/v2/search`, {
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
      console.error("fetchAttractoionsByUUID", error);
      throw error;
    }
};

// fetch review & rating from backend
export const fetchReviewRatingByUUID = async(uuid) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/attractions/${uuid}/reviews`)
    return response.data;
  } catch (error) {
    console.error("fetchReviewRatingByUUID", error);
    throw error;
  }
};

export const fetchReviewStatsByUUID = async(uuid) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/reviews/attraction/${uuid}`)
    return response;
  } catch (error) {
    console.error("fetchReviewStatsByUUID", error);
    throw error;
  }
}

// send transformed attraction data to backend
export const sendTransformedAttractionDataToBackEnd = async(attractions) => {
  try {
    const response = await fetch(`${BACKEND_URL}/attractions/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attractions),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data stored:", data);
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

// post attraction data to back end
// {
//   "userId": 123, 
//   "attractionId": 456, 
//   "visitDate": "2025-02-07", 
//   "numberOfTickets": 2
// }
export const sendAttractionBookingToBackEnd = async (attractionBooking) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/attractions/booking`, attractionBooking, {
      headers: { "Content-Type": "application/json" }
    });
    return response
  } catch (error) {
    console.error("Error Booking Attraction:", error.response ? error.response.data : error.message);
  }
};

// 取消景点预订
export const cancelAttractionBooking = async (bookingId) => {
  try {
      const response = await axios.delete(`${BACKEND_URL}/attractions/booking/${bookingId}`);
      return response.data;
  } catch (error) {
      console.error("Error canceling attraction booking:", error);
      throw error;
  }
}
