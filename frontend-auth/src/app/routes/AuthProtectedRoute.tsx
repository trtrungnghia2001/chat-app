import { useAuthStore } from "@/features/auth/stores/auth.store";

import { Navigate, Outlet } from "react-router-dom";

const AuthProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default AuthProtectedRoute;
