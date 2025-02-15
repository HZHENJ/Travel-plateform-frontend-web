import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchUserSchedule = async (userId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/attractions/bookings/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return [];
  }
};

export const cancelSchedule = async () => {
  
};

export const fetchUserHotelBookings = async (userId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/hotels/bookings/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return [];
  }
};