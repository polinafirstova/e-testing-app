const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment
  ? (import.meta.env.VITE_API_URL as string) || "http://localhost:5000/api"
  : "/api";
