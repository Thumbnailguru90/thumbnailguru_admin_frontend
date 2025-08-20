// import React, { useState, useEffect, useRef } from "react";
// import { SectionTab } from "polotno/side-panel";
// import { FaUpload } from "react-icons/fa";
// import { getImageSize } from "polotno/utils/image";
// import { IP } from "../../../utils/Constent";
// import UploadItem from "../../../uploads/UploadItem";
// import { createUpload } from "../../../uploads/api";
// import { Tabs, Tab } from "@blueprintjs/core";

// const UploadTab = ({ active, onClick }) => {
//   return (
//     <SectionTab active={active} onClick={onClick}>
//       <div className="flex flex-col items-center space-y-1">
//         <FaUpload />
//         <span>Uploads</span>
//       </div>
//     </SectionTab>
//   );
// };

// const UploadPanel = ({ store }) => {
//   const [uploads, setUploads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [uploadProgressMap, setUploadProgressMap] = useState({});
//   const [selectedTab, setSelectedTab] = useState("images");
//   const [isDragging, setIsDragging] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0); // Add refresh key

//   const dropRef = useRef(null);

//   useEffect(() => {
//     fetchUploads();
//   }, [refreshKey]);

//   const fetchUploads = async () => {
//     try {
//       const response = await fetch(`${IP}/api/v1/admin-uploads`);
//       if (!response.ok) throw new Error("Failed to fetch uploads");
//       const data = await response.json();
//       setUploads(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUploadClick = async (upload) => {
//     if (upload.type === "image") {
//       if (
//         upload.url.endsWith(".svg") ||
//         upload.url.startsWith("data:image/svg+xml")
//       ) {
//         // Handle SVG as a vector element
//         const page = store.activePage || store.addPage();
//         page.addElement({
//           type: "svg",
//           src: upload.url,
//           width: 200,
//           height: 200,
//           x: 100,
//           y: 100,
//           resizable: true,
//           lockUniScaling: false,
//           locked: false,
//           keepRatio: false,
//         });
//       } else {
//         // Handle regular images
//         const { width, height } = await getImageSize(upload.url);
//         const maxWidth = 400;
//         const scale = width > maxWidth ? maxWidth / width : 1;

//         store.activePage.addElement({
//           type: "image",
//           src: upload.url,
//           width: width * scale,
//           height: height * scale,
//         });
//       }
//     } else if (upload.type === "video") {
//       // Handle video uploads
//       store.activePage.addElement({
//         type: "video",
//         src: upload.url,
//         width: 300,
//         height: 200,
//       });
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const res = await fetch(`${IP}/api/v1/admin-uploads/${id}`, {
//         method: "DELETE",
//       });
//       if (!res.ok) throw new Error("Failed to delete upload");
//       setUploads((prev) => prev.filter((upload) => upload._id !== id));
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleFileUpload = async (file) => {
//     try {
//       const formData = new FormData();
//       formData.append("files", file);

//       // Add progress tracking for this file
//       setUploadProgressMap((prev) => ({
//         ...prev,
//         [file.name]: 0,
//       }));

//       const newUpload = await createUpload(formData, (percent) =>
//         setUploadProgressMap((prev) => ({
//           ...prev,
//           [file.name]: percent,
//         }))
//       );

//       setRefreshKey((prev) => prev + 1); // This will trigger useEffect

//       // Remove progress once upload is done
//       setUploadProgressMap((prev) => {
//         const newMap = { ...prev };
//         delete newMap[file.name];
//         return newMap;
//       });
//     } catch (err) {
//       alert(err.message || "Upload failed");

//       setUploadProgressMap((prev) => {
//         const newMap = { ...prev };
//         delete newMap[file.name];
//         return newMap;
//       });
//     }
//   };

//   const handleMultipleUploads = async (files) => {
//     for (const file of files) {
//       await handleFileUpload(file);
//     }
//   };

//   const handleDrop = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);

//     const files = Array.from(e.dataTransfer.files);
//     if (files.length > 0) {
//       await handleMultipleUploads(files);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDragEnter = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
//   };

//   if (loading) return <div className="p-4">Loading uploads...</div>;
//   if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

//   // Categorize uploads
//   const categorizedUploads = uploads.reduce((acc, upload) => {
//     const category =
//       upload.type === "image" &&
//       (upload.url.endsWith(".svg") ||
//         upload.url.startsWith("data:image/svg+xml"))
//         ? "vectors"
//         : upload.type === "image"
//         ? "images"
//         : "others";
//     if (!acc[category]) acc[category] = [];
//     acc[category].push(upload);
//     return acc;
//   }, {});

//   return (
//     <div
//       className="p-2 space-y-4 overflow-auto relative"
//       style={{ height: "100%" }}
//     >
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-medium">Admin Uploads</h3>
//         <button
//           onClick={() => setIsFormOpen(true)}
//           className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Add
//         </button>
//       </div>

//       {isFormOpen && (
//         <div className="bg-gray-100 p-4 rounded shadow">
//           <input
//             type="file"
//             multiple
//             accept="image/*,video/*,application/pdf"
//             onChange={(e) => {
//               const files = Array.from(e.target.files);
//               if (files.length) {
//                 handleMultipleUploads(files);
//                 setIsFormOpen(false);
//               }
//             }}
//             className="w-full"
//           />
//         </div>
//       )}

//       {/* Dedicated Drag and Drop Box */}
//       <div
//         ref={dropRef}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         onDragEnter={handleDragEnter}
//         onDragLeave={handleDragLeave}
//         className={`border-2 border-dashed rounded-lg p-6 text-center mb-4 transition-colors ${
//           isDragging
//             ? "border-blue-500 bg-blue-50"
//             : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
//         }`}
//       >
//         <FaUpload className="mx-auto text-gray-400 text-2xl mb-2" />
//         <p className="text-gray-600 mb-1">Drag & drop files here</p>
//         <p className="text-sm text-gray-500">or</p>
//         <button
//           onClick={() => setIsFormOpen(true)}
//           className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
//         >
//           Browse Files
//         </button>
//       </div>

//       {Object.entries(uploadProgressMap).map(([filename, percent]) => (
//         <div key={filename} className="mb-2">
//           <div className="text-xs text-gray-700 mb-1">
//             {filename} ({percent}%)
//           </div>
//           <div className="w-full bg-gray-200 rounded h-3">
//             <div
//               className="bg-blue-600 h-3 rounded"
//               style={{ width: `${percent}%` }}
//             ></div>
//           </div>
//         </div>
//       ))}

//       <Tabs
//         selectedTabId={selectedTab}
//         onChange={setSelectedTab}
//         renderActiveTabPanelOnly
//       >
//         {Object.entries(categorizedUploads).map(([category, items]) => (
//           <Tab
//             key={category}
//             id={category}
//             title={category.charAt(0).toUpperCase() + category.slice(1)}
//             panel={
//               <div className="grid grid-cols-2 gap-4 mt-4">
//                 {items.map((upload) => (
//                   <div
//                     key={`${upload._id}-${refreshKey}`} // Add refreshKey to force re-render
//                     onClick={() => handleUploadClick(upload)}
//                     className="cursor-pointer"
//                   >
//                     <UploadItem
//                       upload={upload}
//                       onDelete={handleDelete}
//                       isSvg={category === "vectors"}
//                     />
//                   </div>
//                 ))}
//               </div>
//             }
//           />
//         ))}
//       </Tabs>
//     </div>
//   );
// };

// export const UploadSection = {
//   name: "uploads",
//   Tab: UploadTab,
//   Panel: UploadPanel,
// };

import React, { useState, useEffect, useRef } from "react";
import { SectionTab } from "polotno/side-panel";
import { FaUpload, FaEllipsisV } from "react-icons/fa";
import { getImageSize } from "polotno/utils/image";
import { IP } from "../../../utils/Constent";
import UploadItem from "../../../uploads/UploadItem";
import { createUpload } from "../../../uploads/api";
import { Tabs, Tab } from "@blueprintjs/core";

const UploadTab = ({ active, onClick }) => {
  return (
    <SectionTab active={active} onClick={onClick}>
      <div className="flex flex-col items-center space-y-1">
        <FaUpload />
        <span>Uploads</span>
      </div>
    </SectionTab>
  );
};

const UploadPanel = ({ store }) => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploadProgressMap, setUploadProgressMap] = useState({});
  const [selectedTab, setSelectedTab] = useState("images");
  const [isDragging, setIsDragging] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const dropRef = useRef(null);

  useEffect(() => {
    fetchUploads();
  }, [refreshKey]);

  const fetchUploads = async () => {
    try {
      const response = await fetch(`${IP}/api/v1/admin-uploads-not-pagination`);
      if (!response.ok) throw new Error("Failed to fetch uploads");
      const data = await response.json();
      setUploads(data.uploads);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = async (upload) => {
    if (upload.type === "image") {
      if (
        upload.url.endsWith(".svg") ||
        upload.url.startsWith("data:image/svg+xml")
      ) {
        const page = store.activePage || store.addPage();
        page.addElement({
          type: "svg",
          src: upload.url,
          width: 200,
          height: 200,
          x: 100,
          y: 100,
          resizable: true,
          lockUniScaling: false,
          locked: false,
          keepRatio: false,
        });
      } else {
        const { width, height } = await getImageSize(upload.url);
        const maxWidth = 400;
        const scale = width > maxWidth ? maxWidth / width : 1;

        store.activePage.addElement({
          type: "image",
          src: upload.url,
          width: width * scale,
          height: height * scale,
        });
      }
    } else if (upload.type === "video") {
      store.activePage.addElement({
        type: "video",
        src: upload.url,
        width: 300,
        height: 200,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${IP}/api/v1/admin-uploads/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete upload");
      setUploads((prev) => prev.filter((upload) => upload._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("files", file);

      setUploadProgressMap((prev) => ({
        ...prev,
        [file.name]: 0,
      }));

      const newUpload = await createUpload(formData, (percent) =>
        setUploadProgressMap((prev) => ({
          ...prev,
          [file.name]: percent,
        }))
      );

      setRefreshKey((prev) => prev + 1);

      setUploadProgressMap((prev) => {
        const newMap = { ...prev };
        delete newMap[file.name];
        return newMap;
      });
    } catch (err) {
      alert(err.message || "Upload failed");
      setUploadProgressMap((prev) => {
        const newMap = { ...prev };
        delete newMap[file.name];
        return newMap;
      });
    }
  };

  const handleMultipleUploads = async (files) => {
    for (const file of files) {
      await handleFileUpload(file);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleMultipleUploads(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  if (loading) return <div className="p-4">Loading uploads...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  const categorizedUploads = uploads.reduce((acc, upload) => {
    const category =
      upload.type === "image" &&
      (upload.url.endsWith(".svg") ||
        upload.url.startsWith("data:image/svg+xml"))
        ? "vectors"
        : upload.type === "image"
        ? "images"
        : "others";
    if (!acc[category]) acc[category] = [];
    acc[category].push(upload);
    return acc;
  }, {});

  return (
    <div
      className="p-2 space-y-4 overflow-auto relative"
      style={{ height: "100%" }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Admin Uploads</h3>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <input
            type="file"
            multiple
            accept="image/*,video/*,application/pdf"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              if (files.length) {
                handleMultipleUploads(files);
                setIsFormOpen(false);
              }
            }}
            className="w-full"
          />
        </div>
      )}

      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 text-center mb-4 transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        }`}
      >
        <FaUpload className="mx-auto text-gray-400 text-2xl mb-2" />
        <p className="text-gray-600 mb-1">Drag & drop files here</p>
        <p className="text-sm text-gray-500">or</p>
        <button
          onClick={() => setIsFormOpen(true)}
          className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Browse Files
        </button>
      </div>

      {Object.entries(uploadProgressMap).map(([filename, percent]) => (
        <div key={filename} className="mb-2">
          <div className="text-xs text-gray-700 mb-1">
            {filename} ({percent}%)
          </div>
          <div className="w-full bg-gray-200 rounded h-3">
            <div
              className="bg-blue-600 h-3 rounded"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>
      ))}

      <Tabs
        selectedTabId={selectedTab}
        onChange={setSelectedTab}
        renderActiveTabPanelOnly
      >
        {Object.entries(categorizedUploads).map(([category, items]) => (
          <Tab
            key={category}
            id={category}
            title={category.charAt(0).toUpperCase() + category.slice(1)}
            panel={
              <div className="grid grid-cols-2 gap-4 mt-4">
                {items.map((upload) => (
                  <div
                    key={`${upload._id}-${refreshKey}`}
                    onClick={() => handleUploadClick(upload)}
                    className="cursor-pointer relative group"
                  >
                    <UploadItem
                      upload={upload}
                      onDelete={() => handleDelete(upload._id)}
                      onDownload={() => handleDownload(upload.url, upload.name)}
                      isSvg={category === "vectors"}
                    />
                  </div>
                ))}
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  );
};

export const UploadSection = {
  name: "uploads",
  Tab: UploadTab,
  Panel: UploadPanel,
};
