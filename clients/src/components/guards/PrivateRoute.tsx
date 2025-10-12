import { Navigate, Outlet } from "react-router-dom";
import { getAuth, isAdmin } from "../../utils/auth";

export function RequireAuth() {
  return getAuth() ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RequireAdmin() {
  const auth = getAuth();
  if (!auth) return <Navigate to="/login" replace />;
  return isAdmin() ? <Outlet /> : <Navigate to="/homes" replace />;
}
