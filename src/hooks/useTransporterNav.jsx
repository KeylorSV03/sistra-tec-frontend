import {
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  Bell,
} from "lucide-react";

export function useTransporterNav() {
  return [
    { to: "/transporter/dashboard", icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard" },
    { to: "/transporter/assignments", icon: <ClipboardList className="w-4 h-4" />, label: "Mis asignaciones" },
    { to: "/transporter/confirm-action", icon: <CheckSquare className="w-4 h-4" />, label: "Confirmar acción" },
    { to: "/transporter/notifications", icon: <Bell className="w-4 h-4" />, label: "Notificaciones" },
  ];
}
