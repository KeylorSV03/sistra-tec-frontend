import axios from "axios";

let accessToken = null;

export const setAccessToken = (token) => { accessToken = token; };

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;
        if (error.response?.status === 401 && !original._retry && !original.url?.includes("refresh")) {
            original._retry = true;
            try {
                const { data } = await api.post("/api/auth/refresh");
                setAccessToken(data.accessToken);
                return api(original);
            } catch {
                setAccessToken(null);
            }
        }
        return Promise.reject(new Error(error.response?.data?.message || "Error inesperado. Intenta de nuevo."));
    }
);

export default api;
