import { Dialog, InputGroup, Button } from "@blueprintjs/core";
import { useTemplate } from "./useTemplate";

const SaveTemplateDialog = ({ isOpen, onClose, store, templateId }) => {
  const {
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
  } = useTemplate({ isOpen, templateId });

  const renderSubCategoryTree = (nodes, depth = 0) => {
    return (
      <ul className={`pl-${depth * 4} list-none space-y-1`}>
        {nodes.map((node) => {
          const hasChildren = node.subCategories?.length > 0;
          const isChecked = selectedSubCategories.includes(node._id);
          const indentClass = `pl-${depth * 4}`;

          return (
            <li key={node._id} className={`py-1 ${indentClass}`}>
              <div className="flex items-center group hover:bg-gray-50 rounded px-2 py-1 transition-colors">
                <label className="flex items-center flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSubCategory(node._id)}
                    className={`mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 ${
                      isChecked
                        ? "opacity-100"
                        : "opacity-80 group-hover:opacity-100"
                    }`}
                  />
                  <span
                    className={`flex-1 ${
                      isChecked ? "font-medium text-blue-700" : "text-gray-700"
                    }`}
                  >
                    {node.subCategoryName}
                  </span>
                </label>

                {hasChildren && (
                  <span className="text-xs text-gray-400 ml-2">
                    {node.subCategories.length} sub-items
                  </span>
                )}
              </div>

              {hasChildren && (
                <div className="mt-1 ml-2 border-l-2 border-gray-200 pl-2">
                  {renderSubCategoryTree(node.subCategories, depth + 1)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };
  const onSave = async () => {
    const success = await handleSave(store);
    if (success) {
      alert(
        templateId
          ? "Template updated successfully!"
          : "Template saved successfully!"
      );
      onClose();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={templateId ? "Update Template" : "Save Template"}
      className="w-full max-w-md"
    >
      <div className="p-6 space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name
              </label>
              <InputGroup
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Summer Banner"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategoryObj?.subCategories?.length > 0 && (
              <div className="mt-4 border rounded-md p-3 max-h-60 overflow-y-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Subcategories
                </label>
                {renderSubCategoryTree(selectedCategoryObj.subCategories)}
              </div>
            )}

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex gap-2">
                <InputGroup
                  placeholder="Enter a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTag();
                  }}
                  rightElement={
                    <Button
                      minimal
                      icon="plus"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                    />
                  }
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1.5 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button
                intent="success"
                fill
                text={isSaving ? "Saving..." : "Save"}
                onClick={onSave}
                disabled={isSaving}
                loading={isSaving}
                className="w-full flex justify-center items-center"
              />
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default SaveTemplateDialog;

// import React, { useEffect, useState } from "react";
// import { Dialog, InputGroup, Button, Spinner } from "@blueprintjs/core";
// import { IP } from "../../../utils/Constent";

// const SaveTemplateDialog = ({
//   isOpen,
//   onClose,
//   store,
//   templateId,
//   initialData = {},
// }) => {
//   const [templateName, setTemplateName] = useState(initialData.name || "");
//   const [categories, setCategories] = useState([]);
//   const [subCategoryList, setSubCategoryList] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(
//     initialData.category?._id || ""
//   );
//   const [selectedSubCategory, setSelectedSubCategory] = useState(
//     initialData.subCategory?._id || ""
//   );
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     setTemplateName(initialData.name || "");
//     setSelectedCategory(initialData.category?._id || "");
//     setSelectedSubCategory(initialData.subCategory?._id || "");
//   }, [initialData]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch(`${IP}/api/v1/get/categories`);
//         const data = await res.json();
//         setCategories(data || []);
//       } catch (err) {
//         console.error("Failed to load categories", err);
//       }
//     };
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (selectedCategory) {
//       const fetchSubCategories = async () => {
//         try {
//           const res = await fetch(
//             `${IP}/api/v1/subcategory/by-category?categoryId=${selectedCategory}`
//           );
//           const data = await res.json();
//           setSubCategoryList(data);
//         } catch (err) {
//           console.error("Failed to load subcategories", err);
//         }
//       };
//       fetchSubCategories();
//     } else {
//       setSubCategoryList([]);
//     }
//   }, [selectedCategory]);

//   const handleSave = async () => {
//     if (!templateName) {
//       return alert("Template name is required.");
//     }

//     setIsSaving(true);
//     try {
//       await store.waitLoading();
//       const json = store.toJSON();
//       const previewDataURL = await store.toDataURL({ pixelRatio: 0.2 });

//       const endpoint = templateId
//         ? `${IP}/api/v1/templates/${templateId}`
//         : `${IP}/api/v1/create/template`;

//       const method = templateId ? "PUT" : "POST";

//       const res = await fetch(endpoint, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: templateName,
//           category: selectedCategory || null,
//           subCategory: selectedSubCategory || null,
//           json,
//           previewBase64: previewDataURL,
//           width: store.width,
//           height: store.height,
//         }),
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message || "Failed to save template");

//       alert(`Template ${templateId ? "updated" : "saved"} successfully!`);
//       onClose(true); // Pass true to indicate success
//     } catch (err) {
//       console.error("Save failed:", err);
//       alert(err.message || "Failed to save template");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <Dialog
//       isOpen={isOpen}
//       onClose={onClose}
//       title={templateId ? "Update Template" : "Save Template"}
//       style={{ width: "400px" }}
//     >
//       <div style={{ padding: "20px" }}>
//         <label className="block font-bold mb-1">Template Name</label>
//         <InputGroup
//           value={templateName}
//           onChange={(e) => setTemplateName(e.target.value)}
//           placeholder="e.g., Summer Banner"
//         />

//         <label className="block font-bold mt-4 mb-1">Category</label>
//         <div className="bp4-select bp4-fill">
//           <select
//             value={selectedCategory}
//             onChange={(e) => {
//               setSelectedCategory(e.target.value);
//               setSelectedSubCategory("");
//             }}
//           >
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat._id} value={cat._id}>
//                 {cat.categoryName}
//               </option>
//             ))}
//           </select>
//         </div>

//         <label className="block font-bold mt-4 mb-1">SubCategory</label>
//         <div className="bp4-select bp4-fill">
//           <select
//             value={selectedSubCategory}
//             onChange={(e) => setSelectedSubCategory(e.target.value)}
//             disabled={!selectedCategory}
//           >
//             <option value="">Select SubCategory</option>
//             {Array.isArray(subCategoryList) &&
//               subCategoryList.map((sub) => (
//                 <option key={sub._id} value={sub._id}>
//                   {sub.subCategoryName}
//                 </option>
//               ))}
//           </select>
//         </div>

//         <Button
//           intent="primary"
//           fill
//           className="mt-4"
//           text={templateId ? "Update Template" : "Save Template"}
//           onClick={handleSave}
//           disabled={isSaving}
//         >
//           {isSaving && <Spinner size={20} className="mr-2" />}
//           {isSaving ? "Saving..." : templateId ? "Update" : "Save"}
//         </Button>
//       </div>
//     </Dialog>
//   );
// };

// export default SaveTemplateDialog;
