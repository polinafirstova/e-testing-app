import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { isAuthenticated } from "../services/auth";

function ProtectedRoute(): React.JSX.Element {
  const location = useLocation();
  const isAuth = isAuthenticated();
  console.log("[ProtectedRoute] Результат проверки:", isAuth);
  console.log("-> Ожидаемый токен из .env:", import.meta.env.VITE_ADMIN_TOKEN);
  console.log(
    "-> Токен, который лежит в LocalStorage:",
    localStorage.getItem("admin_token"),
  );

  if (!isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
