import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { isAuthenticated } from "../services/auth";

function ProtectedRoute(): React.JSX.Element {
  const location = useLocation();
  const isAuth = isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
