import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "../adminLayout/Layout";
import Dashboard from "../pages/dashboard/Dashbord";
import Category from "../pages/Category/Category";
import SubCategory from "../pages/subCategory/subCategory";
import TemplateList from "../pages/templates/TemplateList";
import Editor from "../pages/editor/Editor";
import UserManagement from "../pages/user/UserManagement";
import AddTemplateEditor from "../pages/editor/AddTemplateEditor";

import FontManager from "../../FontManager/FontManager";
import UploadManager from "../../uploads/UploadManager";
import AdminShapeUpload from "../../Element/AdminElementUpload";
import PlanManager from "../../PlanManagement/PlanManager";
import { DraftProvider } from "../Context/DraftProvider";
import PurchaseTable from "../../Purchase/PurchaseTable";
import BlogForm from "../../blogs/BlogForm";
import BlogManagement from "../../blogs/BlogManagement";
import ImageUploader from "../../imageUpload/ImageUploader";
import BackgroundUploader from "../../backgroundUpload/BackgroundUploader";
import BackgroundList from "../../backgroundUpload/BackgroundList";
import ImageList from "../../imageUpload/ImageList";
import ProtectedRoute from "../ProtectedRoute";
import SoftDeletedTemplatesPage from "../../SoftDeletedTemplatesPage/SoftDeletedTemplatesPage";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Protected routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "superadmin"]} />}>
        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="category" element={<Category />} />
          <Route path="sub-category" element={<SubCategory />} />
          <Route path="templates/list" element={<TemplateList />} />
          <Route path="users" element={<UserManagement />} />

          <Route path="fonts" element={<FontManager />} />
          <Route path="uploads" element={<UploadManager />} />
          <Route path="elements" element={<AdminShapeUpload />} />
          <Route path="plans" element={<PlanManager />} />
          <Route path="purchase" element={<PurchaseTable />} />
          <Route path="blog" element={<BlogForm />} />
          <Route path="blog/edit/:slug" element={<BlogForm />} />
          <Route path="blog/list" element={<BlogManagement />} />
          <Route path="images/upload" element={<ImageUploader />} />
          <Route path="images/list" element={<ImageList />} />
          <Route path="background/upload" element={<BackgroundUploader />} />
          <Route path="background/list" element={<BackgroundList />} />
          <Route path="deleted/list" element={<SoftDeletedTemplatesPage />} />
        </Route>

        {/* Editor routes outside Layout */}
        <Route
          path="templates/add"
          element={
            <DraftProvider>
              <AddTemplateEditor />
            </DraftProvider>
          }
        />
        <Route path="editor/:id" element={<Editor />} />

        {/* Default route */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
