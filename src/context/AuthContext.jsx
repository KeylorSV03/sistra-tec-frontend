import { createContext, useEffect, useState } from "react";
import { authService, clearSession, getStoredUser } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const saved = getStoredUser();
    if (saved) setUser(saved);

    authService
      .verificar()
      .then((res) => {
        if (mounted) setUser(res.data.usuario);
      })
      .catch(() => {
        clearSession();
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const loginUser = async ({ identificacion, password }) => {
    const res = await authService.login({ identificacion, password });
    setUser(res.data.usuario);
    return { usuario: res.data.usuario };
  };

  const logoutUser = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
