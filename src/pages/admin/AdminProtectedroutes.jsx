// src/components/AdminProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const adminToken = sessionStorage.getItem("adminToken"); // بدل الاسم حسب كيف خزنته
  return adminToken ? children : <Navigate to="/login" />;
};

export default AdminProtectedRoute;
/* test */