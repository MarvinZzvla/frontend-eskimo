import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  const hasSession = document.cookie.includes("session=");
  const hasLocalStorageLogin = localStorage.getItem("login");

  return hasSession || hasLocalStorageLogin;
};

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
