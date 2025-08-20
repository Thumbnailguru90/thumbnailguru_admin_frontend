import { useState, useEffect } from "react";
import { fetchCategories, fetchTemplate, saveTemplate } from "./templateApi";

import { message } from "antd";

export const useTemplate = ({ isOpen, templateId }) => {
  const [templateName, setTemplateName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchCategories();
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
        setError("Failed to load categories. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  // In your useTemplate hook, modify the useEffect that watches selectedCategoryId
  useEffect(() => {
    if (!selectedCategoryId) {
      setSelectedCategoryObj(null);
      setSelectedSubCategories([]); // Clear subcategories when no category is selected
      return;
    }

    const category = categories.find((cat) => cat._id === selectedCategoryId);
    setSelectedCategoryObj(category || null);
    // setSelectedSubCategories([]); // Clear subcategories when changing categories
  }, [selectedCategoryId, categories]);

  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId || !categories.length) return;

      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchTemplate(templateId);
        setTemplateName(data.name);
        setSelectedCategoryId(data.category);

        // Wait until categories are fully loaded before setting subcategories
        if (categories.length) {
          const category = categories.find((cat) => cat._id === data.category);
          if (category) {
            // Only set subcategories after confirming the full tree is loaded
            setSelectedSubCategories(data.subCategories || []);
          }
        }

        setTags(data.tags || []);
      } catch (err) {
        console.error("Failed to fetch template for editing:", err);
        setError("Failed to load template data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadTemplate();
    }
  }, [templateId, isOpen, categories]);

  const toggleSubCategory = (id) => {
    setSelectedSubCategories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async (store) => {
    if (!templateName) {
      setError("Template name is required.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await store.waitLoading();
      const json = await store.toJSON();

      const previewDataURL = await store.toDataURL({
        pixelRatio: 2,
        quality: 0.95,
        mimeType: "image/jpeg",
      });

      const payload = {
        name: templateName,
        category: selectedCategoryId,
        subCategories: selectedSubCategories,
        tags,
        json,
        previewBase64: previewDataURL,
        width: store.width,
        height: store.height,
      };

      // ✅ Add userId only on creation
      if (!templateId) {
        const userId = localStorage.getItem("userID");
        payload.userId = userId;
      }
      const result = await saveTemplate(templateId, payload);

      // More flexible success checking
      if (result.error || result.message?.toLowerCase().includes("fail")) {
        throw new Error(result.message || "Failed to save template");
      }

      // Show success toast
      message.success(
        result.message ||
          (templateId
            ? "Template updated successfully!"
            : "Template saved successfully!")
      );

      return true;
    } catch (err) {
      console.error("Save failed:", err);

      // Show error toast only if it's a real error
      if (!err.message.toLowerCase().includes("success")) {
        setError(err.message || "Failed to save template");
        message.error(err.message || "Failed to save template");
      }

      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    state: {
      templateName,
      categories,
      selectedCategoryId,
      selectedCategoryObj,
      selectedSubCategories,
      tags,
      tagInput,
      isLoading,
      isSaving,
      error,
    },
    actions: {
      setTemplateName,
      setSelectedCategoryId,
      toggleSubCategory,
      setTagInput,
      handleAddTag,
      removeTag,
      handleSave,
    },
  };
};
