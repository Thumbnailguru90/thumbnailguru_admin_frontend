import React from "react";
import "../../App.css";
import { FaLock } from "react-icons/fa"; // React Icons for the lock icon
import { Link } from "react-router-dom";

const UnauthorizedAccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div
        className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg border border-gray-200 
                      flex flex-col items-center justify-center text-center 
                      animate-fadeIn"
      >
        <FaLock className="text-red-500 text-6xl mb-4 animate-pulse" />
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page. Please contact your
          administrator if you believe this is a mistake.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 text-white buttonp rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
