import axios from "axios";

// Set the base URL for Axios
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

// Add the Bearer token to all requests if it exists
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
