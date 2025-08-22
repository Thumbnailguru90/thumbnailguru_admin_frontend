

// const API_URL = "http://localhost:5000/api/v1/admin-uploads";
import axios from "axios";
import { IP } from "../utils/Constent";

const API_URL = `${IP}/api/v1/admin-uploads`;
// const API_URL = "http://localhost:5000/api/v1/admin-uploads";
// Get all uploads with pagination
export const getUploads = async ({ page = 1, limit = 9, userId,searchTerm  } = {}) => {
  try {
    const params = { page, limit };
    if (userId) params.userId = userId; // optional filter
        if (searchTerm) params.searchTerm = searchTerm; // search term


    const response = await axios.get(API_URL, { params });
    return response.data; // should be { uploads, total, page, pages }
  } catch (error) {
    console.error("Error fetching uploads:", error);
    throw error;
  }
};

// Create new upload
export const createUpload = async (formData, onProgress) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress(percent);
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating upload:", error);
    throw error;
  }
};

// Delete upload
export const deleteUpload = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting upload:", error);
    throw error;
  }
};
