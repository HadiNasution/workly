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
import { ContextProvider } from "./context/context-provider.jsx";

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
    <ContextProvider>
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
    </ContextProvider>
  </React.StrictMode>
);
