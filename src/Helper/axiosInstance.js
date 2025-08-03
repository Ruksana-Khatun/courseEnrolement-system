import axios from "axios";
import { getAuthToken, clearAuthData } from "./authUtils";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    console.log("📌 Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      hasToken: !!token,
      hasData: !!config.data
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    
    // Handle specific backend errors
    if (error.response?.data?.message?.includes('comparePassword')) {
      console.error("🔍 Backend Error: User not found in database");
    }
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      console.log("🔐 401 Unauthorized - Clearing authentication data");
      clearAuthData();
      // You might want to redirect to login page here
      // window.location.href = '/login';
    }
    
    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      console.log("🚫 403 Forbidden - Access denied");
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
