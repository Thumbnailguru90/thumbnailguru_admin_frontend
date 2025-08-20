import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "../adminLayout/Layout";

import UserManagement from "../pages/user/UserManagement";
import Dashboard from "../pages/dashboard/Dashbord";
import StaffUser from "../../StaffUser/StaffUser";
import StaffTransaction from "../../StaffUser/StaffTransaction";
import ProtectedRoute from "../ProtectedRoute";



const StaffRoutes = () => {
  return (
    <Routes>
      {/* Protected routes */}
      <Route element={<ProtectedRoute allowedRoles="staff" />}>
        <Route element={<Layout />}>
          {/* <Route path="users" element={<UserManagement />} /> */}
        {/* <Route path="dashboard" element={<Dashboard />} /> */}
        <Route path="users" element={<StaffUser />} />
        <Route path="transactions" element={<StaffTransaction />} />

        </Route>
      </Route>
    </Routes>
  );
};

export default StaffRoutes;
