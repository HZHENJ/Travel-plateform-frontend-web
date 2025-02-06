import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const CONTENT_LANGUAGE = import.meta.env.VITE_CONTENT_LANGUAGE;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// fetch all hotels data from api
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

// fetch hotel by uuid
export const fetchAttractoionsByUUID = async(uuid) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/content/attractions/v2/search`, {
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

// send transformed attraction data to backend
export const sendTransformedAttractionDataToBackEnd = async(attractions) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/attractions/save`, {
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
//   "ticketType": "Standard", 
//   "numberOfTickets": 2
// }
export const sendAttractionBookingToBackEnd = async(attracionBooking) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/attractions/booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attracionBooking)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json();
    console.log("Booking Result", data);
  } catch (error) {
    console.error("Error Booking Attracion:", error);
  }
}