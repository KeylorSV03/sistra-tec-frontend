import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/verificarUsuario")
            .then((res) => setUser(res.data.usuario))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const loginUser = async (identificacion, password) => {
        const res = await api.post("/api/iniciarSesion", { identificacion, password });
        setUser(res.data.usuario);
        return res.data;
    };

    const logoutUser = async () => {
        await api.post("/api/cerrarSesion");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
}
