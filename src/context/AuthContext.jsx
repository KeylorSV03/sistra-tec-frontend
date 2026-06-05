import { createContext, useState, useEffect } from "react";
import api, { setAccessToken } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.post("/api/auth/refresh")
            .then(({ data }) => {
                setAccessToken(data.accessToken);
                return api.get("/api/auth/profile");
            })
            .then(({ data }) => setUser(data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const loginUser = async (email, password) => {
        const { data } = await api.post("/api/auth/login", { email, password });
        setAccessToken(data.accessToken);
        setUser(data.user);
        return data;
    };

    const logoutUser = async () => {
        await api.post("/api/auth/logout");
        setAccessToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
}
