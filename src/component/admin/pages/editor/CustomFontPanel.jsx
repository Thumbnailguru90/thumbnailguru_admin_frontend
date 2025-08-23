import React, { useState, useEffect, useRef, useCallback } from "react";
import { SectionTab } from "polotno/side-panel";
import { FaFont, FaSpinner, FaPlus, FaImage } from "react-icons/fa";
import { IP } from "../../../utils/Constent";

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

const FontTab = ({ active, onClick }) => {
  return (
    <SectionTab active={active} onClick={onClick}>
      <div className="flex flex-col items-center space-y-1">
        <FaFont />
        <span>Font Images</span>
      </div>
    </SectionTab>
  );
};

const CustomFontPanel = ({ store }) => {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const observer = useRef();

  // Memoized fetch function
  const fetchFonts = useCallback(async (pageNum = 1, isSearch = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(
        `${IP}/api/v1/customfont?page=${pageNum}&limit=10&search=${encodeURIComponent(
          debouncedSearchTerm
        )}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch font images");
      const data = await response.json();

      // Adjust this based on your actual API response structure
      const fontsData = data.data || data;
      
      if (pageNum === 1 || isSearch) {
        setFonts(fontsData);
      } else {
        setFonts((prev) => [...prev, ...fontsData]);
      }

      // Check if there are more pages
      setHasMore(fontsData.length === 10);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearchTerm]);

  // Effect for search and initial load
  useEffect(() => {
    setPage(1);
    fetchFonts(1, true);
  }, [debouncedSearchTerm, fetchFonts]);

  const lastItemRef = useCallback(
    (node) => {
      if (loadingMore || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchFonts(nextPage);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore, page, fetchFonts]
  );

  const handleFontImageClick = (font) => {
    const page = store.activePage;
    
    // Create an image element instead of text
    page.addElement({
      type: "image",
      src: font.fontUrl,
      width: 600,
      height: 300,
      x: page.width / 2 - 150,
      y: page.height / 2 - 50,
      keepRatio: true,
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${IP}/api/v1/customfont/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete font image");
      
      // Refresh the first page after deletion
      setPage(1);
      fetchFonts(1, true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddFontImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("name", file.name.replace(/\.[^/.]+$/, ""));

      const response = await fetch(`${IP}/api/v1/customfont/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload font image");
      
      // Refresh the first page after upload
      setPage(1);
      fetchFonts(1, true);
      setIsFormOpen(false);
    } catch (err) {
      alert(err.message || "Upload failed");
    }
  };

  if (loading) return <div className="p-4">Loading font images...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-2 space-y-4 overflow-auto" style={{ height: "100%" }}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Font Images</h3>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-1" /> Add Font Image
        </button>
      </div>

      <div className="mb-2">
        <input
          type="text"
          placeholder="Search font images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      {isFormOpen && (
        <div className="bg-gray-100 p-4 rounded shadow mb-4">
          <h4 className="text-md font-medium mb-2">Upload New Font Image</h4>
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.webp"
            onChange={handleAddFontImage}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload an image containing text with your desired font style
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4">
        {fonts.map((font, index) => (
          <div
            key={font._id || index}
            ref={index === fonts.length - 1 ? lastItemRef : null}
            onClick={() => handleFontImageClick(font)}
            className="cursor-pointer border rounded-lg p-3 hover:shadow-md transition-shadow"
          >
            <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-2 overflow-hidden">
              <img 
                src={font.fontUrl} 
                alt={font.name}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="text-gray-400 text-sm flex items-center justify-center">
                <FaImage className="mr-1" /> Font Image
              </div>
            </div>
            <div className="text-sm font-medium truncate">{font.name}</div>
            {font.tags && font.tags.length > 0 && (
              <div className="text-xs text-gray-500 mt-1 truncate">
                Tags: {font.tags.slice(0, 3).join(', ')}
                {font.tags.length > 3 && '...'}
              </div>
            )}
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(font._id);
                }}
                className="text-red-500 text-xs hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {fonts.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No font images found
        </div>
      )}

      {loadingMore && (
        <div className="flex justify-center py-4">
          <FaSpinner className="animate-spin text-blue-600 text-2xl" />
        </div>
      )}
    </div>
  );
};

export const CustomFontSection = {
  name: "custom-fonts",
  Tab: FontTab,
  Panel: CustomFontPanel,
};