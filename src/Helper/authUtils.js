// Utility functions for authentication

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  return token && isLoggedIn === "true";
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const getUserData = () => {
  const data = localStorage.getItem("data");
  return data ? JSON.parse(data) : null;
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("data");
  localStorage.removeItem("role");
};

export const setAuthData = (user, token) => {
  localStorage.setItem("token", token);
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("data", JSON.stringify(user));
  // Normalize role to uppercase for consistency
  localStorage.setItem("role", user?.role?.toUpperCase() || "");
};

// Validate token format (basic validation)
export const isValidToken = (token) => {
  if (!token) return false;
  // Basic JWT token validation (should have 3 parts separated by dots)
  const parts = token.split('.');
  return parts.length === 3;
};

// Fix role format in localStorage (for existing sessions)
export const fixRoleFormat = () => {
  const currentRole = localStorage.getItem("role");
  if (currentRole && currentRole !== currentRole.toUpperCase()) {
    console.log("🔧 Fixing role format:", currentRole, "→", currentRole.toUpperCase());
    localStorage.setItem("role", currentRole.toUpperCase());
    return true;
  }
  return false;
}; 