import axios from "axios";

const getApiUrl = () => {
  const hostname = window.location.hostname; // Obtiene la IP o dominio del servidor
  console.log(hostname);
  return `http://${hostname}:3000/api`; // Ajusta el puerto si es necesario
};

const apiClient = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
