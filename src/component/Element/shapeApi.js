// src/api/shapeApi.js
import axios from "axios";
import { IP } from "../utils/Constent";

const API_BASE = `${IP}/api/v1/admin/shapes`;

export const uploadShape = (formData) =>
  axios.post(API_BASE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getShapes = () => axios.get(`${IP}/api/v1/admin/shapes-admin`);

export const deleteShape = (id) => axios.delete(`${API_BASE}/${id}`);
