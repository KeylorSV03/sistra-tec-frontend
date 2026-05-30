import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

// ─── Usuarios de prueba para modo demo ────────────────────────────────────────
const MOCK_USERS = [
  {
    correo: "admin@sistratec.cr",
    password: "admin123",
    usuario: {
      id: 1,
      nombre: "Carlos Rodríguez",
      correo: "admin@sistratec.cr",
      tipoUsuario: 1,
    },
  },
  {
    correo: "donante@sistratec.cr",
    password: "donante123",
    usuario: {
      id: 2,
      nombre: "María González",
      correo: "donante@sistratec.cr",
      tipoUsuario: 2,
    },
  },
  {
    correo: "transportista@sistratec.cr",
    password: "trans123",
    usuario: {
      id: 3,
      nombre: "Luis Mora",
      correo: "transportista@sistratec.cr",
      tipoUsuario: 3,
    },
  },
];

const SESSION_KEY = "sistra_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sesión desde sessionStorage al recargar
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      // ignorar
    } finally {
      setLoading(false);
    }
  }, []);

  const loginUser = async ({ identificacion, password }) => {
    // Simular delay de red
    await new Promise((r) => setTimeout(r, 600));

    const match = MOCK_USERS.find(
      (u) => u.correo === identificacion && u.password === password
    );

    if (!match) {
      throw new Error("Correo o contraseña incorrectos");
    }

    setUser(match.usuario);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(match.usuario));
    return { usuario: match.usuario };
  };

  const logoutUser = async () => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
