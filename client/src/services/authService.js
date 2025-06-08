import axios from "axios";

const API_URL = "/api/users";

// Register user
const registerUser = async (userData) => {
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// Login user
const authUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });

  if (response.data) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// Get user profile
const getUserProfile = async () => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/profile`, config);
  return response.data;
};

export { registerUser, authUser, getUserProfile };
