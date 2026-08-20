// src/config/axios.js
// Common Axios instance — every API call in the app goes through this
// so the backend base URL only ever needs to change in one place (.env).
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

export default api;
