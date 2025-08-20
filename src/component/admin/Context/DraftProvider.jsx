import React, { createContext, useContext } from "react";
import axios from "axios";
import { IP } from "../../utils/Constent";

const DraftContext = createContext();

export const DraftProvider = ({ children }) => {
  //   const IP = "http://localhost:5000/api/v1";

  const saveDraft = async (draftData) => {
    try {
      // Prepare the data to send
      const payload = {
        id: draftData.id,
        json: draftData.json,
        previewBase64: draftData.previewBase64,
        width: draftData.width,
        height: draftData.height,
        userId: draftData.userId,
      };

      // Include ID if we're updating an existing draft
      if (draftData.id) {
        payload.id = draftData.id;
      }

      const response = await axios.post(
        `${IP}/api/v1/templates/draft`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error saving draft:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to save draft",
        error: error.message,
      };
    }
  };

  const getDrafts = async () => {
    try {
      const userId = localStorage.getItem("userID");

      if (!userId) {
        console.warn("No userId found in localStorage.");
        return [];
      }

      const response = await axios.get(`${IP}/api/v1/drafts`, {
        params: { userId }, // add userId as query param
      });

      return response.data.data;
    } catch (error) {
      console.error("Error fetching drafts:", error);
      return [];
    }
  };

  const getDraft = async (id) => {
    try {
      const response = await axios.get(`${IP}/api/v1/draft/${id}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching draft:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch draft",
        error: error.message,
      };
    }
  };

  const deleteDraft = async (id) => {
    try {
      const response = await axios.delete(`${IP}/api/v1/draft/${id}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error deleting draft:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete draft",
        error: error.message,
      };
    }
  };

  return (
    <DraftContext.Provider
      value={{ saveDraft, getDrafts, getDraft, deleteDraft }}
    >
      {children}
    </DraftContext.Provider>
  );
};

export const useDraft = () => {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error("useDraft must be used within a DraftProvider");
  }
  return context;
};
