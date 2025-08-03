import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  const location = useLocation();

  // Check if user has an allowed role (roles are now stored in uppercase)
  const hasAllowedRole = allowedRoles.includes(role);

  console.log("🔐 RequireAuth Debug:", {
    isLoggedIn,
    role,
    allowedRoles,
    hasAllowedRole
  });

  return isLoggedIn && hasAllowedRole ? (
    <Outlet />
  ) : isLoggedIn ? (
    <Navigate to={"/denied"} state={{ from: location }} replace />
  ) : (
    <Navigate to={"/login"} state={{ from: location }} replace />
  );
};

export default RequireAuth;
