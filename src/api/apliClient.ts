import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.1.6:3000/api", // URL base del backend
  withCredentials: true, // Para enviar cookies con las solicitudes (si usas autenticación)
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
