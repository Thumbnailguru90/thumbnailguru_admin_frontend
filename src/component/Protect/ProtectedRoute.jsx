import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  element: Component,
  isLoggedIn,
  userRole,
  allowedRoles,
  ...rest
}) => {
  if (!isLoggedIn) {
    return <Navigate to="/logIn" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
