import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import NotFoundPage from "./components/pages/NotFoundPage";
import ResetPasswordAdmin from "./components/pages/ResetPasswordAdmin";
import ResetPasswordEmployee from "./components/pages/ResetPasswordEmployee";
import AdminHome from "./components/pages/AdminHome";
import EmployeeHome from "./components/pages/EmployeeHome";
import Shot from "./components/pages/Shot";
import { adminAuth, employeeAuth } from "./auth/auth-login";
import ManageEmployee from "./components/pages/ManageEmployee";
import ManageAdmin from "./components/pages/ManageAdmin";
import ManagePermission from "./components/pages/ManagePermission";
import Setting from "./components/pages/Setting";

const ProtectedEmployeeRoute = ({ element, path }) => {
  return employeeAuth() ? (
    element
  ) : (
    <Navigate to="/" replace state={{ from: path }} />
  );
};

const ProtectedAdminRoute = ({ element, path }) => {
  return adminAuth() ? (
    element
  ) : (
    <Navigate to="/" replace state={{ from: path }} />
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/resetpassword/admin" element={<ResetPasswordAdmin />} />
        <Route
          path="/resetpassword/employee"
          element={<ResetPasswordEmployee />}
        />
        <Route
          path="/admin/home"
          element={
            <ProtectedAdminRoute element={<AdminHome />} path="/admin/home" />
          }
        />
        <Route
          path="/admin/manage/employee"
          element={
            <ProtectedAdminRoute
              element={<ManageEmployee />}
              path="/admin/manage/employee"
            />
          }
        />
        <Route
          path="/admin/manage/admin"
          element={
            <ProtectedAdminRoute
              element={<ManageAdmin />}
              path="/admin/manage/admin"
            />
          }
        />
        <Route
          path="/admin/manage/permission"
          element={
            <ProtectedAdminRoute
              element={<ManagePermission />}
              path="/admin/manage/permission"
            />
          }
        />
        <Route
          path="/admin/setting"
          element={
            <ProtectedAdminRoute element={<Setting />} path="/admin/setting" />
          }
        />
        <Route
          path="/employee/home"
          element={
            <ProtectedEmployeeRoute
              element={<EmployeeHome />}
              path="/employee/home"
            />
          }
        />
        <Route path="/shot" element={<Shot />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
