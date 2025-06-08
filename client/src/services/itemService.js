import axios from "axios";

const API_URL = "/api/items";

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

// Get all items for the authenticated user
const getItems = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

// Create a new item
const createItem = async (itemData) => {
  try {
    const response = await axiosInstance.post("/", itemData);
    return response.data;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

// Update an item
const updateItem = async (itemId, itemData) => {
  try {
    const response = await axiosInstance.put(`/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

// Delete an item
const deleteItem = async (itemId) => {
  try {
    const response = await axiosInstance.delete(`/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

// Get items by category
const getItemsByCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching items by category:", error);
    throw error;
  }
};

export { getItems, createItem, updateItem, deleteItem, getItemsByCategory };
