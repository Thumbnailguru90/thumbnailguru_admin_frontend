// src/api/userApi.js
import axios from "axios";
import { IP } from "../../../utils/Constent";

export const fetchUsers = async (page, limit, search, sortBy, sortOrder) => {
  const response = await axios.get(`${IP}/api/v1/user/getAll`, {
    params: {
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    },
  });
  return response.data;
};

export const updateUser = async (id, data) => {
  const res = await axios.put(`${IP}/api/v1/user/update/${id}`, data);
  return res.data;
};


// import axios from "axios";

export const updateCredit = async (userId, creditChange) => {
  const res = await axios.put(`${IP}/api/v1/update-credit`, {
   
    userId,
    creditChange,
  });
  return res.data;
};

// Update call status
export const updateCallStatusApi = async (userId, payload) => {
  const { data } = await axios.put(`${IP}/api/v1/users/${userId}/call-status`, payload);
  return data;
};