import { jwtDecode } from "jwt-decode";

export const getAuthInfo = () => {
  try {
  const token = localStorage.getItem("authToken");
  if (!token) {
      return null;
  }

  const decoded = jwtDecode(token);
    if (!decoded || !decoded.id) {
      localStorage.removeItem("authToken");
      return null;
    }

    return {
      token,
      id: decoded.id,
      role: decoded.role,
      username: decoded.username,
      firstName: decoded.firstName,
      lastName: decoded.lastName
    };
  } catch (error) {
    console.error("Error decoding auth token:", error);
    localStorage.removeItem("authToken");
    return null;
  }
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("authToken", token);
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};

export const checkAdmin = () => {
  const { role } = getAuthInfo();
  if (role !== 'admin') {
    throw new Error('Access denied: Admin privileges required');
  }
  return true;
};