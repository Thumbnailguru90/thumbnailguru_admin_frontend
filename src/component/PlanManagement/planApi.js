import axios from "axios";
import { IP } from "../utils/Constent";

// const API_URL = "http://localhost:5000/api/v1/plans";
const API_URL = `${IP}/api/v1/plans`;
export const getPlans = () => axios.get(API_URL);
export const createPlan = (data) => axios.post(API_URL, data);
export const updatePlan = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deletePlan = (id) => axios.delete(`${API_URL}/${id}`);
