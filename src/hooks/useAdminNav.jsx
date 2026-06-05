import {
  LayoutDashboard,
  Package,
  Archive,
  Truck,
  UserPlus,
  Bell,
} from "lucide-react";

export function useAdminNav() {
  return [
    { to: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard" },
    { to: "/admin/donations", icon: <Package className="w-4 h-4" />, label: "Donaciones" },
    { to: "/admin/inventory", icon: <Archive className="w-4 h-4" />, label: "Inventario" },
    { to: "/admin/transporters", icon: <Truck className="w-4 h-4" />, label: "Transportistas" },
    { to: "/admin/create-transporter", icon: <UserPlus className="w-4 h-4" />, label: "Crear transportista" },
    { to: "/admin/notifications", icon: <Bell className="w-4 h-4" />, label: "Notificaciones" },
  ];
}
