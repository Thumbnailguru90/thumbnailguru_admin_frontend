import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "../adminLayout/Layout";

import UserManagement from "../pages/user/UserManagement";
import Dashboard from "../pages/dashboard/Dashbord";
import StaffUser from "../../StaffUser/StaffUser";
import StaffTransaction from "../../StaffUser/StaffTransaction";
import ProtectedRoute from "../ProtectedRoute";
import SubCategory from "../pages/subCategory/subCategory";
import FontManager from "../../FontManager/FontManager";
import UploadManager from "../../uploads/UploadManager";

import ImageList from "../../imageUpload/ImageList";
import BackgroundUploader from "../../backgroundUpload/BackgroundUploader";
import BackgroundList from "../../backgroundUpload/BackgroundList";
import AddTemplateEditor from "../pages/editor/AddTemplateEditor";
import Editor from "../pages/editor/Editor";

import AdminShapeUpload from "../../Element/AdminElementUpload";
import ImageUploader from "../../imageUpload/ImageUploader";
import { DraftProvider } from "../Context/DraftProvider";
import SubAdminSubCategory from "../../../subAdminPages/SubAdminSubCategory";
import TemplateList from "../../../subAdminPages/Template/TemplateList";


const SubAdminRoutes = () => {
  return (
    <Routes>
      {/* Protected routes */}
      <Route element={<ProtectedRoute allowedRoles="subadmin" />}>
        <Route element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
          <Route path="sub-category" element={<SubAdminSubCategory />} />
            <Route path="fonts" element={<FontManager />} />
          <Route path="uploads" element={<UploadManager />} />
          <Route path="elements" element={<AdminShapeUpload />} />
                    <Route path="templates/list" element={<TemplateList />} />
                     <Route path="images/upload" element={<ImageUploader />} />
          <Route path="images/list" element={<ImageList />} />
          <Route path="background/upload" element={<BackgroundUploader />} />
          <Route path="background/list" element={<BackgroundList />} />
          

        </Route>
          <Route
                  path="templates/add"
                  element={
                    <DraftProvider>
                      <AddTemplateEditor />
                    </DraftProvider>
                  }
                />
                <Route path="editor/:id" element={<Editor />} />
      </Route>
    </Routes>
  );
};

export default SubAdminRoutes;
