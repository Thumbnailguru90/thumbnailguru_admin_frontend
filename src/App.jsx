import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./component/landing/landingPage/Login";
import AdminRoutes from "./component/admin/adminRoutes/AdminRoute";
import { TemplateProvider } from "./component/admin/Context/TemplateContext";
import StaffRoutes from "./component/admin/StaffRoutes/StaffRoutes";
import SubAdminRoutes from "./component/admin/subAdminRoutes/SubAdminRoutes";

function App() {
  return (
    <TemplateProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
  <Route path="/staff/*" element={<StaffRoutes />} />
  <Route path="/subadmin/*" element={<SubAdminRoutes />} />
  
  <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </TemplateProvider>
  );
}

export default App;
