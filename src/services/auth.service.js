import axios from 'axios'
import { API_ENDPOINTS } from '@/constants/api'

export const authService = {
    login: async (credentials) => {
        const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
        return response.data
    }
}
