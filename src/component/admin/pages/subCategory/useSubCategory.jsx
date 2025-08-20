import { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { IP } from "../../../utils/Constent";

const useSubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${IP}/api/v1/get/categories`);
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${IP}/api/v1/get/subcategories`);
      setSubCategories(data);
    } catch (error) {
      console.error("Failed to fetch subcategories");
    }
    setLoading(false);
  };

  const addOrUpdateSubCategory = async (subCategory, isEditing) => {
    try {
      if (isEditing) {
        await axios.put(
          `${IP}/api/v1/update/subcategory/${subCategory._id}`,
          subCategory
        );
        message.success("SubCategory updated successfully");
      } else {
        await axios.post(`${IP}/api/v1/create/subcategory`, subCategory);
        message.success("SubCategory added successfully");
      }
      fetchSubCategories();
    } catch (error) {
      message.error("Failed to save subcategory");
    }
  };
  // const addOrUpdateSubCategory = async (subCategory, isEditing, id = null) => {
  //   try {
  //     if (isEditing) {
  //       await axios.put(`${IP}/api/v1/update/subcategory`, subCategory, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });
  //       message.success("SubCategory updated successfully");
  //     } else {
  //       await axios.post(`${IP}/api/v1/create/subcategory`, subCategory, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });
  //       message.success("SubCategory added successfully");
  //     }

  //     fetchSubCategories();
  //   } catch (error) {
  //     console.error(error);
  //     message.error("Failed to save subcategory");
  //   }
  // };

  const deleteSubCategory = async (id) => {
    try {
      await axios.delete(`${IP}/api/v1/delete/subcategory/${id}`);
      message.success("SubCategory deleted successfully");
      fetchSubCategories();
    } catch (error) {
      message.error("Failed to delete subcategory");
    }
  };

  return {
    subCategories,
    categories,
    loading,
    fetchSubCategories,
    addOrUpdateSubCategory,
    deleteSubCategory,
  };
};

export default useSubCategory;
