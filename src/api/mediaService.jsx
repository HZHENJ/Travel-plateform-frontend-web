import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const CONTENT_LANGUAGE = import.meta.env.VITE_CONTENT_LANGUAGE;

// 
export const fetchMediaByLibraryUuid = async (libraryUUID) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/media/libraries/v2/details/${libraryUUID}`, {
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": API_KEY,
                    "X-Content-Language": CONTENT_LANGUAGE,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error", error);
        throw error;
    }
};

// fetch media by uuid
export const fetchMediaByUuid = async (uuid) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/media/common/v2/search`, {
                params: {
                    "searchType": "uuids",
                    "searchValues": uuid,
                    "category": "accommodation"
                },
                headers: {
                    "X-API-Key": API_KEY,
                    "X-Content-Language": CONTENT_LANGUAGE,
                }
            }
        ); 
        return response.data;
    } catch (error){
        console.error("Error fetching media by uuid:", error);
        throw error;
    }
};

// download media file by uuid
export const downloadMeidaFileByUUID = async (uuid)=>{
    try {
        const response = await axios.get(
            `${API_BASE_URL}/media/download/v2/${uuid}`, {
                params: {
                    "fileType": "Small Thumbnail"
                },
                headers: {
                    "X-API-Key": API_KEY,
                    "X-Content-Language": CONTENT_LANGUAGE,
                }
            }
        )
    } catch (error) {
        console.log("Error downloading media file by uuid:", error);
        throw error;
    }
}