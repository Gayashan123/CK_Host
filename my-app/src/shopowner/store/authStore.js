import { create } from "zustand";
import axios from "axios";

// Configure axios instance with base settings
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const useAuthStore = create((set, get) => ({
  user: null,
  shop: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  // Auth actions
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await api.post("/api/auth/signup", { 
        email, 
        password, 
        name 
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      await get().fetchShop();
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await api.post("/api/auth/login", { email, password });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
      await get().fetchShop();
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null, message: null });
    try {
      await api.post("/api/auth/logout");
      set({
        user: null,
        shop: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "Error logging out",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await api.post("/api/auth/verify-email", { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      await get().fetchShop();
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null, message: null });
    try {
      const response = await api.get("/api/auth/check-auth");
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
        error: null,
      });
      await get().fetchShop();
    } catch (error) {
      set({
        user: null,
        shop: null,
        isCheckingAuth: false,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  // Shop actions
  fetchShop: async () => {
    try {
      const shopResponse = await api.get("/api/shops/my-shop");
      set({ shop: shopResponse.data.shop });
    } catch (error) {
      set({ shop: null });
    }
  },

  // Password actions
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await api.post("/api/auth/forgot-password", { email });
      set({
        message: response.data.message,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await api.post(`/api/auth/reset-password/${token}`, { 
        password 
      });
      set({
        message: response.data.message,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || "Error resetting password",
      });
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await api.post("/api/auth/change-password", { 
        currentPassword, 
        newPassword 
      });
      set({
        isLoading: false,
        error: null,
        message: response.data.message,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || "Error changing password",
      });
      throw error;
    }
  },

  updateProfile: async (name, email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await api.post("/api/auth/update-profile", { 
        name, 
        email 
      });
      set({
        user: response.data.user,
        isLoading: false,
        error: null,
        message: response.data.message,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || "Error updating profile",
      });
      throw error;
    }
  },
}));