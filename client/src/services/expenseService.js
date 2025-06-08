import axios from "axios";

const API_URL = "/api/expenses";

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

// Get all expenses
const getExpenses = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

// Create new expense
const createExpense = async (expenseData) => {
  try {
    const response = await axiosInstance.post("/", expenseData);
    return response.data;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
};

// Update expense
const updateExpense = async (expenseId, expenseData) => {
  try {
    const response = await axiosInstance.put(`/${expenseId}`, expenseData);
    return response.data;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};

// Delete expense
const deleteExpense = async (expenseId) => {
  try {
    const response = await axiosInstance.delete(`/${expenseId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};

// Get expense summary
const getExpenseSummary = async () => {
  try {
    const response = await axiosInstance.get("/summary");
    return response.data;
  } catch (error) {
    console.error("Error fetching expense summary:", error);
    throw error;
  }
};

export {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
};
