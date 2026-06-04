import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { toast } from "react-toastify";

import { notificationService } from "../../services/api";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import DonationIcon from "../../components/ui/DonationIcon";
import FilterTabs from "../../components/ui/FilterTabs";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";

const ICON_MAP = {
  "En tránsito": (
    <div
      aria-hidden="true"
      className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center"
    >
      🚚
    </div>
  ),
  Entregado: (
    <div
      aria-hidden="true"
      className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center text-green-600"
    >
      ✓
    </div>
  ),
  alerta: (
    <div
      aria-hidden="true"
      className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center"
    >
      ⚠
    </div>
  ),
  default: <DonationIcon size="sm" />,
};

/**
 * Generic notifications page.
 * sidebar: <Sidebar> for the current role
 * role: "Donante" | "Admin" | "Transportista"
 */
export default function NotificationsPage({ sidebar, role }) {
  usePageTitle("Notificaciones");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Todas");
  const [announcement, setAnnouncement] = useState("");

  const load = () => {
    setLoading(true);
    notificationService
      .listar()
      .then((res) => setNotifications(res.data.notificaciones ?? []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const unread = notifications.filter((n) => !n.leido);
  const filtered = activeTab === "Sin leer" ? unread : notifications;

  const markAll = async () => {
    try {
      await notificationService.marcarTodasLeidas();
      setNotifications((prev) => prev.map((n) => ({ ...n, leido: true })));
      setAnnouncement("Todas las notificaciones fueron marcadas como leídas.");
      toast.success("Todas las notificaciones fueron marcadas como leídas.");
    } catch {
      toast.error("Error al marcar notificaciones");
    }
  };

  const tabs = [
    { key: "Todas", label: "Todas", count: notifications.length },
    { key: "Sin leer", label: "Sin leer", count: unread.length },
  ];

  return (
    <DashboardLayout sidebar={sidebar}>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <PageHeader
        title="Notificaciones"
        subtitle={`${unread.length} notificaciones sin leer`}
        action={
          <Button
            variant="secondary"
            onClick={markAll}
            disabled={unread.length === 0}
            aria-label={`Marcar como leídas ${unread.length} notificaciones sin leer`}
          >
            <Bell aria-hidden="true" className="w-4 h-4" />
            Marcar todas como leídas
          </Button>
        }
      />

      <div className="max-w-2xl">
        <div className="mb-5">
          <FilterTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
          {loading ? (
            <p role="status" className="text-sm text-gray-600 text-center py-10">
              Cargando...
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-gray-600 text-center py-10">
              Sin notificaciones.
            </p>
          ) : (
            filtered.map((n) => (
              <article
                key={n.id}
                aria-label={`${n.leido ? "Leída" : "Sin leer"}: ${n.mensaje}`}
                className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition relative"
              >
                {ICON_MAP[n.tipo] ?? ICON_MAP.default}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{n.mensaje}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{n.tiempo}</p>
                </div>
                {n.leido ? (
                  <span className="text-xs text-gray-600 shrink-0">Leído</span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-primary-600 mt-1 shrink-0">
                    <span className="sr-only">Sin leer</span>
                  </span>
                )}
              </article>
            ))
          )}
        </div>

        {role && (
          <p className="text-xs text-gray-600 mt-4 text-center">
            Las notificaciones se filtran según tu rol actual:{" "}
            <strong className="text-gray-600">{role}</strong>
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
