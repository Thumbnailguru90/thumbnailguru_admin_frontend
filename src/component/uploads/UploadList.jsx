import React, { useState, useEffect } from "react";
import UploadItem from "./UploadItem";
import { deleteUpload, getUploads } from "./api";

const UploadList = ({ onUploadSuccess }) => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 9; // items per page

  useEffect(() => {
    fetchUploads(page);
  }, [onUploadSuccess, page]);

  const fetchUploads = async (currentPage = 1) => {
    try {
      setLoading(true);
      const data = await getUploads({ page: currentPage, limit });

      // Backend returns { uploads, total, page, pages }
      setUploads(data.uploads || []);
      setPages(data.pages || 1);
      setError(null);
    } catch (err) {
      setError("Failed to load uploads");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUpload(id);
      setUploads(uploads.filter((upload) => upload._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div>
      {/* Grid of uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {uploads.map((upload) => (
          <UploadItem
            key={upload._id}
            upload={upload}
            onDelete={() => handleDelete(upload._id)}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {pages > 1 && (
        <div className="flex justify-center items-center space-x-4 py-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-1 rounded ${
              page === 1 ? "bg-gray-200" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Prev
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-1 rounded ${
              page === pages ? "bg-gray-200" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadList;
