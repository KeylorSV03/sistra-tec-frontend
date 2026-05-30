import { NavLink, useNavigate } from "react-router-dom";
import { Heart, LogOut } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { authService } from "../../../services/api";
import { toast } from "react-toastify";

/**
 * Role-aware sidebar navigation.
 * navItems: [{ to, icon, label }]
 */
export default function Sidebar({ navItems }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch {
      toast.error("Error al cerrar sesión");
    }
  };

  const initials = user?.nombre
    ? user.nombre
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <aside className="w-[270px] min-h-screen bg-dark-900 flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-dark-700">
        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shrink-0">
          <Heart className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">SISTRA-TEC</p>
          <p className="text-gray-400 text-xs">Sistema de donaciones</p>
        </div>
      </div>

      {/* User info */}
      {user && (
        <div className="flex items-center gap-3 px-5 py-4 border-b border-dark-700">
          <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user.nombre}</p>
            <p className="text-gray-400 text-xs truncate">{user.correo}</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3">
          Menú principal
        </p>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-primary-600 text-white font-medium"
                      : "text-gray-400 hover:text-white hover:bg-dark-700"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-dark-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-dark-700 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
