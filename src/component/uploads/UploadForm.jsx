// import React, { useState } from "react";
// import { createUpload } from "./api";

// const UploadForm = ({ onSuccess }) => {
//   const [file, setFile] = useState(null);
//   const [name, setName] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setError("Please select a file");
//       return;
//     }

//     setIsUploading(true);
//     setError("");

//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       if (name) formData.append("name", name);

//       const newUpload = await createUpload(formData);
//       onSuccess(newUpload);
//       setFile(null);
//       setName("");
//     } catch (err) {
//       setError(err.message || "Upload failed");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold mb-4">Upload New File</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2">File</label>
//           <input
//             type="file"
//             onChange={(e) => setFile(e.target.files[0])}
//             className="w-full p-2 border rounded"
//             accept="image/*,video/*,application/pdf"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2">Name (optional)</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full p-2 border rounded"
//             placeholder="Custom name for the file"
//           />
//         </div>

//         {error && <div className="text-red-500 mb-4">{error}</div>}

//         <button
//           type="submit"
//           disabled={isUploading || !file}
//           className={`px-4 py-2 rounded text-white ${
//             isUploading || !file
//               ? "bg-blue-300"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {isUploading ? "Uploading..." : "Upload"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UploadForm;

import React, { useState } from "react";
import { createUpload } from "./api";

const UploadForm = ({ onSuccess }) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progressMap, setProgressMap] = useState({});
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    setIsUploading(true);
    setError("");
    setProgressMap({});

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("files", file);

        await createUpload(formData, (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgressMap((prev) => ({ ...prev, [file.name]: percent }));
        });
      }

      setFiles([]);
      onSuccess();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload New Files</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Files</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
            className="w-full p-2 border rounded"
            accept="image/*,video/*,application/pdf"
          />
        </div>

        {files.map((file) => (
          <div key={file.name} className="mb-2">
            <p className="text-sm text-gray-700 truncate">{file.name}</p>
            <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-200 ease-out"
                style={{ width: `${progressMap[file.name] || 0}%` }}
              />
            </div>
          </div>
        ))}

        {error && <div className="text-red-500 mt-4">{error}</div>}

        <button
          type="submit"
          disabled={isUploading || files.length === 0}
          className={`mt-4 px-4 py-2 rounded text-white ${
            isUploading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload All"}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
