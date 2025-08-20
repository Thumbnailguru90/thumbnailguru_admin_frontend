import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Forbidden from "../Errors/Forbidden";

const getAuthInfo = () => {
  const userID = localStorage.getItem("userID");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "admin" or "staff"
  return { userID, token, role };
};

const ProtectedRoute = ({ allowedRoles }) => {
  const { userID, token, role } = getAuthInfo();

  if (!userID || !token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Forbidden />; // Show 403 Forbidden error page
  }

  return <Outlet />;
};

export default ProtectedRoute;
