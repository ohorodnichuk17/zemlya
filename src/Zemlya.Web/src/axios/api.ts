import axios from "axios";

export const baseUrl = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});