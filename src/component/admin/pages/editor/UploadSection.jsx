import React, { useState, useEffect, useRef, useCallback } from "react";
import { SectionTab } from "polotno/side-panel";
import { FaUpload, FaEllipsisV, FaSpinner } from "react-icons/fa";
import { getImageSize } from "polotno/utils/image";
import { IP } from "../../../utils/Constent";
import UploadItem from "../../../uploads/UploadItem";
import { createUpload } from "../../../uploads/api";
import { Tabs, Tab } from "@blueprintjs/core";

// Debounce hook for search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

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
  const [uploads, setUploads] = useState({
    images: { data: [], pagination: {} },
    vectors: { data: [], pagination: {} },
    others: { data: [], pagination: {} },
  });

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploadProgressMap, setUploadProgressMap] = useState({});
  const [selectedTab, setSelectedTab] = useState("images");
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const dropRef = useRef(null);
  const observer = useRef();

  const lastItemRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();

      const activeUploads = uploads[selectedTab];
      if (!activeUploads || !activeUploads.pagination.hasNextPage) return;

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingMore, uploads, selectedTab]
  );

  useEffect(() => {
    fetchUploads(1);
  }, [debouncedSearchTerm, refreshKey]);

  const fetchUploads = async (page = 1) => {
    try {
      setLoading(page === 1);
      setLoadingMore(page > 1);

      const response = await fetch(
        `${IP}/api/v1/admin-uploads-categorized?page=${page}&limit=5&search=${encodeURIComponent(
          debouncedSearchTerm
        )}`
      );
      if (!response.ok) throw new Error("Failed to fetch uploads");
      const data = await response.json();

      if (page === 1) {
        setUploads(data);
      } else {
        setUploads((prev) => ({
          images: {
            ...data.images,
            data: [...prev.images.data, ...data.images.data],
          },
          vectors: {
            ...data.vectors,
            data: [...prev.vectors.data, ...data.vectors.data],
          },
          others: {
            ...data.others,
            data: [...prev.others.data, ...data.others.data],
          },
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    const activeUploads = uploads[selectedTab];
    if (!loadingMore && activeUploads.pagination.hasNextPage) {
      fetchUploads(activeUploads.pagination.currentPage + 1);
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
      // Refresh the uploads after deletion
      setRefreshKey(prev => prev + 1);
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

      // Refresh the uploads after successful upload
      setRefreshKey(prev => prev + 1);

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

  return (
    <div
      className="p-2 space-y-4 overflow-auto relative"
      style={{ height: "100%" }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
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

      {/* Search bar */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
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
        {Object.keys(uploads).map((category) => (
          <Tab
            key={category}
            id={category}
            title={category.charAt(0).toUpperCase() + category.slice(1)}
            panel={
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  {uploads[category].data.map((upload, index) => (
                    <div
                      key={upload._id}
                      ref={
                        index === uploads[category].data.length - 1
                          ? lastItemRef
                          : null
                      }
                      onClick={() => handleUploadClick(upload)}
                      className="cursor-pointer relative group"
                    >
                      <UploadItem
                        upload={upload}
                        onDelete={() => handleDelete(upload._id)}
                        onDownload={() =>
                          handleDownload(upload.url, upload.name)
                        }
                        isSvg={category === "vectors"}
                      />
                    </div>
                  ))}
                </div>

                {uploads[category].data.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No {category} found
                  </div>
                )}

                {loadingMore && (
                  <div className="flex justify-center py-4">
                    <FaSpinner className="animate-spin text-blue-600 text-2xl" />
                  </div>
                )}

                {!uploads[category].pagination.hasNextPage &&
                  uploads[category].data.length > 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No more {category} to load
                    </div>
                  )}
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
// import React, { useState, useEffect, useRef } from "react";
// import { SectionTab } from "polotno/side-panel";
// import { FaUpload, FaEllipsisV } from "react-icons/fa";
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
//   const [refreshKey, setRefreshKey] = useState(0);

//   const dropRef = useRef(null);

//   useEffect(() => {
//     fetchUploads();
//   }, [refreshKey]);

//   const fetchUploads = async () => {
//     try {
//       const response = await fetch(`${IP}/api/v1/admin-uploads-not-pagination`);
//       if (!response.ok) throw new Error("Failed to fetch uploads");
//       const data = await response.json();
//       setUploads(data.uploads);
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

//   const handleDownload = (url, name) => {
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = name || "download";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleFileUpload = async (file) => {
//     try {
//       const formData = new FormData();
//       formData.append("files", file);

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

//       setRefreshKey((prev) => prev + 1);

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
//                     key={`${upload._id}-${refreshKey}`}
//                     onClick={() => handleUploadClick(upload)}
//                     className="cursor-pointer relative group"
//                   >
//                     <UploadItem
//                       upload={upload}
//                       onDelete={() => handleDelete(upload._id)}
//                       onDownload={() => handleDownload(upload.url, upload.name)}
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
