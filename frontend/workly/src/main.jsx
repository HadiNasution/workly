import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import NotFoundPage from "./components/pages/NotFoundPage";
import ResetPasswordAdmin from "./components/pages/ResetPasswordAdmin";
import ResetPasswordEmployee from "./components/pages/ResetPasswordEmployee";
import AdminHome from "./components/pages/AdminHome";

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
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/employee/home" element={<AdminHome />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
