import axios from "axios";

const API_URL = "/api/categories";

// Create axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Get all categories
const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Create new category
const createCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post("/", categoryData);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Update category
const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await axiosInstance.put(`/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Delete category
const deleteCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.delete(`/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// Get category with items
const getCategoryWithItems = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/${categoryId}/items`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category with items:", error);
    throw error;
  }
};

export {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryWithItems,
};
