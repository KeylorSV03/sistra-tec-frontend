import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

// Interceptor centralizado de errores
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const mensaje =
            error.response?.data?.message || "Error inesperado. Intenta de nuevo.";
        return Promise.reject(new Error(mensaje));
    }
);

export default api;
