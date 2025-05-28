import { getAuthInfo } from './auth';

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.data) {
      localStorage.setItem("authToken", data.data);
      // Get user info from token
      const { role } = getAuthInfo();
      return {
        success: true,
        user: { email, role },
        redirectTo: role === 'admin' ? '/admin' : '/dashboard'
      };
    }
    return { success: false, message: data.message || "Login failed" };
  } catch (error) {
    return {
      success: false,
      message: error.message || "An error occurred during login",
    };
  }
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        user: data.data || userData,
      };
    }
    return { success: false, message: data.message || "Registration failed" };
  } catch (error) {
    return {
      success: false,
      message: error.message || "An error occurred during registration",
    };
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${API_URL}/user/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    });

    // Clear localStorage regardless of response
    localStorage.removeItem("authToken");

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || "Logged out successfully",
      };
    }
    throw new Error(data.message || "Logout failed");
  } catch (error) {
    localStorage.removeItem("authToken");
    return {
      success: false,
      message: error.message || "An error occurred during logout",
    };
  }
};

export const getAllUsers = async () => {
  try {
    const { token, role } = getAuthInfo();
    
    // Check if user is admin
    if (role !== 'admin') {
      throw new Error('Access denied. Admin privileges required.');
    }

    const response = await fetch(`${API_URL}/user/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch users');
    }

    return await response.json();
  } catch (error) {
    throw error.message || { error: 'Failed to fetch users' };
  }
};

export const getPostsOfUser = async (userId) => {
  try {
    const { token } = getAuthInfo();
    
    const response = await fetch(`${API_URL}/posts/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user posts');
    }

    return await response.json();
  } catch (error) {
    throw error.message || { error: 'Failed to fetch user posts' };
  }
};
