import React, { useState, useEffect } from "react";
import UploadItem from "./UploadItem";
import { deleteUpload, getUploads } from "./api";

const UploadList = ({ onUploadSuccess }) => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      const data = await getUploads({ 
        page: currentPage, 
        limit, 
        searchTerm: searchTerm.trim() 
      });

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

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchUploads(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setPage(1);
    fetchUploads(1);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div>
      {/* Search Bar */}
      <div className="p-4 bg-white shadow-md rounded-lg mb-4">
        <form onSubmit={handleSearch} className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear
            </button>
          )}
        </form>
      </div>

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

      {/* No results message */}
      {uploads.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? "No uploads found matching your search." : "No uploads found."}
        </div>
      )}

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