import {
  LayoutDashboard,
  Heart,
  List,
  Bell,
} from "lucide-react";

export function useDonorNav() {
  return [
    { to: "/donor/dashboard", icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard" },
    { to: "/donor/register-donation", icon: <Heart className="w-4 h-4" />, label: "Registrar donación" },
    { to: "/donor/my-donations", icon: <List className="w-4 h-4" />, label: "Mis donaciones" },
    { to: "/donor/notifications", icon: <Bell className="w-4 h-4" />, label: "Notificaciones" },
  ];
}
