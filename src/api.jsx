// src/api.js
import axios from "axios";




// Use different base URL depending on environment
const API_BASE =
  import.meta.env.PROD
    ? "https://client-ylky.onrender.com/api" // your live Render backend
    :  "http://localhost:5000/api";
 // local dev (Vite proxy)

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
});


// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// Endpoints
export const ADMIN_LOGIN = "/admin/login";
export const ADMIN_REGISTER = "/admin/register";
export const ADMIN_TESTS = "/admin/tests";
export const ADMIN_TESTS_BULK = "/admin/tests/bulk";
export const USER_TESTS = "/tests";
export const SEARCH_TESTS = "/tests/search";
export const DELETE_ALL_TESTS = "/admin/tests/all";

export default api;
