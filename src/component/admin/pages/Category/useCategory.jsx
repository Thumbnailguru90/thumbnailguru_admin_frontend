// import { useEffect, useState } from "react";
// import axios from "axios";
// import { message } from "antd";
// import { IP } from "../../../utils/Constent";

// const useCategory = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.get(`${IP}/api/v1/get/categories`);
//       setCategories(data);
//     } catch (error) {
//       // message.error("Failed to fetch categories");
//     }
//     setLoading(false);
//   };

//   const addOrUpdateCategory = async (formData, id, isEditing) => {
//     console.log(formData);
//     try {
//       const config = {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       };

//       if (isEditing) {
//         await axios.put(`${IP}/api/v1/update/category/${id}`, formData, config);
//         message.success("Category updated successfully");
//       } else {
//         await axios.post(`${IP}/api/v1/create/category`, formData, config);
//         message.success("Category added successfully");
//       }
//       await fetchCategories();
//     } catch (error) {
//       message.error(error.response?.data?.error || "Failed to save category");
//     }
//   };

//   const deleteCategory = async (id) => {
//     try {
//       await axios.delete(`${IP}/api/v1/delete/category/${id}`);
//       message.success("Category deleted successfully");
//       fetchCategories();
//     } catch (error) {
//       message.error("Failed to delete category");
//     }
//   };

//   return {
//     categories,
//     loading,
//     fetchCategories,
//     addOrUpdateCategory,
//     deleteCategory,
//   };
// };

// export default useCategory;



import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { IP } from "../../../utils/Constent";

// Create the context
const CategoryContext = createContext();

// Create a provider component
export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${IP}/api/v1/get/categories`);
      setCategories(data);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
    setLoading(false);
  };

  const addOrUpdateCategory = async (formData, id, isEditing) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEditing) {
        await axios.put(`${IP}/api/v1/update/category/${id}`, formData, config);
        message.success("Category updated successfully");
      } else {
        await axios.post(`${IP}/api/v1/create/category`, formData, config);
        message.success("Category added successfully");
      }
      await fetchCategories();
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to save category");
    }
  };

  

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${IP}/api/v1/delete/category/${id}`);
      message.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      message.error("Failed to delete category");
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        fetchCategories,
        addOrUpdateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

// Create a custom hook to use the context
export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategoryContext must be used within a CategoryProvider");
  }
  return context;
};