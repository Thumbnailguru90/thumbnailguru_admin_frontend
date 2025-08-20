// src/services/templateApiService.js
import axios from "axios";
import { IP } from "../../../../utils/Constent";

const fetchCategories = async () => {
  try {
    const response = await axios.get(
      `${IP}/api/v1/categories-with-subcategories`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
};

const fetchTemplates = async (params) => {
  try {
    const response = await axios.get(`${IP}/api/v1/get-admin/templates`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch templates");
  }
};
const toggleTemplateStatus = async (id) => {
  const response = await axios.put(`${IP}/api/v1/toggle-status/${id}`);
  return response.data;
};

const deleteTemplate = async (id) => {
  try {
    await axios.delete(`${IP}/api/v1/delete/templates/${id}`);
    return true;
  } catch (error) {
    throw new Error("Failed to delete template");
  }
};

const fetchTemplateSuggestions = async (query) => {
  try {
    const res = await axios.get(
      `${IP}/api/v1/template-suggestions?query=${query}`
    );
    return [...new Set(res.data)].slice(0, 8);
  } catch (error) {
    throw new Error("Failed to fetch suggestions");
  }
};

export const templateApiService = {
  fetchCategories,
  fetchTemplates,
  deleteTemplate,
  fetchTemplateSuggestions,
  toggleTemplateStatus,
};
