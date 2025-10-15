// src/api.js
import axios from "axios";

// ✅ Base URL now is just /api (Vite proxy will forward to Render)
const API_BASE = "/api";

// -------------------- Axios instance --------------------
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// -------------------- Request interceptor --------------------
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

// -------------------- Response interceptor --------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/admin/login"; // fixed path
    }
    return Promise.reject(error);
  }
);

// -------------------- Endpoints --------------------

// Admin routes
export const ADMIN_LOGIN = "/admin/login";
export const ADMIN_REGISTER = "/admin/register";
export const ADMIN_TESTS = "/admin/tests";
export const ADMIN_TESTS_BULK = "/admin/tests/bulk";

// User routes
export const USER_TESTS = "/tests";

// -------------------- Export --------------------
export default api;


