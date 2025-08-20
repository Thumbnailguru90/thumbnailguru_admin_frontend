

import React, { useState } from "react";
import { FaEllipsisV, FaDownload, FaTrash } from "react-icons/fa";

const UploadItem = ({ upload, onDelete, onDownload, isSvg = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const isImage = upload.type === "image";
  const isVideo = upload.type === "video";
  const isPDF = upload.type === "application/pdf";

  const svgCheck =
    isImage &&
    (upload.url.endsWith(".svg") ||
      upload.url.startsWith("data:image/svg+xml"));
  const displayAsSvg = isSvg || svgCheck;

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div className="relative group">
      {/* Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer h-full">
        {displayAsSvg ? (
          <div
            className="w-full h-48 flex items-center justify-center bg-gray-50"
            dangerouslySetInnerHTML={{
              __html: upload.url.startsWith("data:image/svg+xml")
                ? decodeURIComponent(upload.url.split(",")[1])
                : `<img src="${upload.url}" alt="${upload.name}" style="max-width:100%;max-height:100%;object-fit:contain" />`,
            }}
          />
        ) : isImage ? (
          <img
            src={upload.thumbnail || upload.url}
            alt={upload.name}
            className="w-full h-48 object-contain"
          />
        ) : isVideo ? (
          <video
            src={upload.url}
            controls
            className="w-full h-48 object-contain"
          />
        ) : isPDF ? (
          <div className="bg-gray-100 w-full h-48 flex items-center justify-center">
            <span className="text-gray-500">PDF Document</span>
          </div>
        ) : (
          <div className="bg-gray-100 w-full h-48 flex items-center justify-center">
            <span className="text-gray-500">File Preview</span>
          </div>
        )}
      </div>

      {/* Three dots menu button */}
      <button
        onClick={toggleMenu}
        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
      >
        <FaEllipsisV className="text-gray-600" />
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <div className="absolute top-10 right-2 bg-white rounded shadow-lg z-10 w-32">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setShowMenu(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center"
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadItem;
