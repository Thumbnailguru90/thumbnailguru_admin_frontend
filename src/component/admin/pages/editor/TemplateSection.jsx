// import { observer } from "mobx-react-lite";
// import { SectionTab } from "polotno/side-panel";
// import MdPhotoLibrary from "@meronex/icons/md/MdPhotoLibrary";
// import { ImagesGrid } from "polotno/side-panel/images-grid";
// import { IP } from "../../../utils/Constent";
// import { useLocation } from "react-router-dom";
// import React, { useState, useEffect } from "react";

// export const TemplatesPanel = observer(({ store }) => {
//   const [categories, setCategories] = useState([
//     { _id: null, categoryName: "All" },
//   ]);
//   const [selectedCategory, setSelectedCategory] = useState({
//     _id: null,
//     categoryName: "All",
//   });
//   const [templates, setTemplates] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeSubCategoryId, setActiveSubCategoryId] = useState(null);

//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const initialSubCategoryId = searchParams.get("subCategoryId");

//   useEffect(() => {
//     if (initialSubCategoryId) {
//       const loadSiblingCategories = async () => {
//         try {
//           const res = await fetch(
//             `${IP}/api/v1/subcategory/parent-and-children/${initialSubCategoryId}`
//           );
//           const data = await res.json();

//           const siblings = data.subCategories.map((sub) => ({
//             _id: sub._id,
//             categoryName: sub.subCategoryName,
//           }));
//           setCategories(siblings);

//           const selected = siblings.find((s) => s._id === initialSubCategoryId);
//           const initialSelected = selected || {
//             _id: initialSubCategoryId,
//             categoryName: "",
//           };

//           setSelectedCategory(initialSelected);
//           setActiveSubCategoryId(initialSelected._id);
//         } catch (err) {
//           console.error("Failed to load subcategory siblings", err);
//         }
//       };

//       loadSiblingCategories();
//     }
//   }, [initialSubCategoryId]);

//   useEffect(() => {
//     if (!initialSubCategoryId) {
//       const fetchCategories = async () => {
//         try {
//           const res = await fetch(`${IP}/api/v1/get/categories`);
//           const data = await res.json();
//           setCategories([{ _id: null, categoryName: "All" }, ...data]);
//         } catch (err) {
//           console.error("Failed to load categories", err);
//         }
//       };
//       fetchCategories();
//     }
//   }, [initialSubCategoryId]);

//   useEffect(() => {
//     const fetchTemplates = async () => {
//       setIsLoading(true);
//       try {
//         const url =
//           activeSubCategoryId === null
//             ? `${IP}/api/v1/get-admin/templates`
//             : `${IP}/api/v1/get-admin/templates?subCategoryId=${activeSubCategoryId}`;

//         const res = await fetch(url);
//         const data = await res.json();

//         const templatesArray = data.templates || [];
//         setTemplates(templatesArray);
//       } catch (error) {
//         console.error("Error fetching templates:", error);
//         setTemplates([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTemplates();
//   }, [activeSubCategoryId]);

//   return (
//     <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
//       {/* Category Buttons */}
//       <div
//         style={{
//           padding: "10px",
//           borderBottom: "1px solid #ddd",
//           display: "flex",
//           gap: "10px",
//           overflowX: "auto",
//           whiteSpace: "nowrap",
//         }}
//       >
//         {categories.map((cat) => (
//           <button
//             key={cat._id || "all"}
//             onClick={() => {
//               setSelectedCategory(cat);
//               setActiveSubCategoryId(cat._id);
//             }}
//             style={{
//               padding: "5px 10px",
//               background: selectedCategory._id === cat._id ? "#007bff" : "#fff",
//               color: selectedCategory._id === cat._id ? "#fff" : "#000",
//               border: "1px solid #007bff",
//               borderRadius: "5px",
//               cursor: "pointer",
//               fontSize: "12px",
//               whiteSpace: "nowrap",
//               flexShrink: 0,
//             }}
//           >
//             {cat.categoryName}
//           </button>
//         ))}
//       </div>

//       {/* Templates Grid - Now using previewPath directly */}
//       <ImagesGrid
//         shadowEnabled={false}
//         images={templates}
//         getPreview={(item) => item.previewPath} // Directly use the URL from API
//         isLoading={isLoading}
//         onSelect={async (item) => {
//           try {
//             const req = await fetch(item.jsonPath); // Use jsonPath directly
//             if (!req.ok) throw new Error(`HTTP error! status: ${req.status}`);

//             const json = await req.json();
//             if (json.objects) {
//               json.objects = json.objects.map((obj) => {
//                 if (obj.type === "image") {
//                   return { ...obj, crossOrigin: "anonymous" };
//                 }
//                 return obj;
//               });
//             }
//             store.loadJSON(json);
//           } catch (error) {
//             console.error("Error loading template:", error);
//             alert(`Failed to load template: ${error.message}`);
//           }
//         }}
//         rowsNumber={1}
//       />
//     </div>
//   );
// });

// export const TemplatesSection = {
//   name: "all-templates",
//   Tab: (props) => (
//     <SectionTab name="ALL Templates" {...props}>
//       <div className="flex flex-col items-center space-y-1">
//         <MdPhotoLibrary />
//       </div>
//     </SectionTab>
//   ),
//   Panel: TemplatesPanel,
// };

import { observer } from "mobx-react-lite";
import { SectionTab } from "polotno/side-panel";
import MdPhotoLibrary from "@meronex/icons/md/MdPhotoLibrary";
import { ImagesGrid } from "polotno/side-panel/images-grid";
import { IP } from "../../../utils/Constent";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import

export const TemplatesPanel = observer(({ store }) => {
  const [categories, setCategories] = useState([
    { _id: null, categoryName: "All" },
  ]);
  const navigate = useNavigate(); // Hook for navigation

  const [selectedCategory, setSelectedCategory] = useState({
    _id: null,
    categoryName: "All",
  });
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubCategoryId, setActiveSubCategoryId] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSubCategoryId = searchParams.get("subCategoryId");

  useEffect(() => {
    if (initialSubCategoryId) {
      const loadSiblingCategories = async () => {
        try {
          const res = await fetch(
            `${IP}/api/v1/subcategory/parent-and-children/${initialSubCategoryId}`
          );
          const data = await res.json();

          const siblings = data.subCategories.map((sub) => ({
            _id: sub._id,
            categoryName: sub.subCategoryName,
          }));
          setCategories(siblings);

          const selected = siblings.find((s) => s._id === initialSubCategoryId);
          const initialSelected = selected || {
            _id: initialSubCategoryId,
            categoryName: "",
          };

          setSelectedCategory(initialSelected);
          setActiveSubCategoryId(initialSelected._id);
        } catch (err) {
          console.error("Failed to load subcategory siblings", err);
        }
      };

      loadSiblingCategories();
    }
  }, [initialSubCategoryId]);

  useEffect(() => {
    if (!initialSubCategoryId) {
      const fetchCategories = async () => {
        try {
          const res = await fetch(`${IP}/api/v1/get/categories`);
          const data = await res.json();
          setCategories([{ _id: null, categoryName: "All" }, ...data]);
        } catch (err) {
          console.error("Failed to load categories", err);
        }
      };
      fetchCategories();
    }
  }, [initialSubCategoryId]);

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const url =
          activeSubCategoryId === null
            ? `${IP}/api/v1/get/templates`
            : `${IP}/api/v1/get/templates?subCategoryId=${activeSubCategoryId}`;

        const res = await fetch(url);
        const data = await res.json();

        const templatesArray = data.templates || [];
        setTemplates(templatesArray);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [activeSubCategoryId]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Category Buttons */}
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat._id || "all"}
            onClick={() => {
              setSelectedCategory(cat);
              setActiveSubCategoryId(cat._id);
            }}
            style={{
              padding: "5px 10px",
              background: selectedCategory._id === cat._id ? "#007bff" : "#fff",
              color: selectedCategory._id === cat._id ? "#fff" : "#000",
              border: "1px solid #007bff",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "12px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <ImagesGrid
        shadowEnabled={false}
        images={templates}
        getPreview={(item) => item.previewPath}
        isLoading={isLoading}
        onSelect={async (item) => {
          try {
            const req = await fetch(item.jsonPath);
            if (!req.ok) throw new Error(`HTTP error! status: ${req.status}`);
            const json = await req.json();

            if (json.objects) {
              json.objects = json.objects.map((obj) => {
                if (obj.type === "image") {
                  return { ...obj, crossOrigin: "anonymous" };
                }
                return obj;
              });
            }

            store.clear(); // ✅ clear first
            store.loadJSON(json);

            // Add watermark after loading the template
            // const watermark = {
            //   type: "text",
            //   text: "SAMPLE", // Your watermark text
            //   fontSize: 40,
            //   fontFamily: "Arial",
            //   fill: "rgba(0,0,0,0.2)", // Semi-transparent
            //   width: 300,
            //   height: 50,
            //   x: store.width / 2 - 150, // Center horizontally
            //   y: store.height / 2 - 25, // Center vertically
            //   rotation: -30, // Diagonal
            //   shadowColor: "rgba(0,0,0,0.1)",
            //   shadowBlur: 5,
            //   locked: true, // Prevent editing
            //   name: "watermark",
            // };

            store.activePage.addElement(watermark);

            const lastSubCategoryId =
              item.subCategories?.[item.subCategories.length - 1]?._id;

            navigate(
              `/admin/editor/${item._id}?subCategoryId=${lastSubCategoryId}`
            );
          } catch (error) {
            console.error("Error loading template:", error);
          }
        }}
        rowsNumber={1}
      />
    </div>
  );
});

export const TemplatesSection = {
  name: "all-templates",
  Tab: (props) => (
    <SectionTab name="ALL Templates" {...props}>
      <div className="flex flex-col items-center space-y-1">
        <MdPhotoLibrary />
      </div>
    </SectionTab>
  ),
  Panel: TemplatesPanel,
};
