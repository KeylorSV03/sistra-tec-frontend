import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { toast } from "react-toastify";

import { notificationService } from "../../services/api";
import DonationIcon from "../../components/ui/DonationIcon";
import FilterTabs from "../../components/ui/FilterTabs";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";

const ICON_MAP = {
  "En tránsito": <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">🚛</div>,
  Entregado: <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center text-green-600">✓</div>,
  alerta: <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center">⚠</div>,
  default: <DonationIcon size="sm" />,
};

/**
 * Generic notifications page.
 * sidebar: <Sidebar> for the current role
 * role: "Donante" | "Admin" | "Transportista"
 */
export default function NotificationsPage({ sidebar, role }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Todas");

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

  const filtered =
    activeTab === "Sin leer" ? unread : notifications;

  const markAll = async () => {
    try {
      await notificationService.marcarTodasLeidas();
      setNotifications((prev) => prev.map((n) => ({ ...n, leido: true })));
    } catch {
      toast.error("Error al marcar notificaciones");
    }
  };

  const tabs = [
    { key: "Todas", label: `Todas (${notifications.length})` },
    { key: "Sin leer", label: `Sin leer (${unread.length})` },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {sidebar}
      <main className="flex-1 overflow-y-auto p-8">
        <PageHeader
          title="Notificaciones"
          subtitle={`${unread.length} notificaciones sin leer`}
          action={
            <Button variant="secondary" onClick={markAll}>
              <Bell className="w-4 h-4" /> Marcar todas como leídas
            </Button>
          }
        />

        <div className="max-w-2xl">
          <div className="mb-5">
            <FilterTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            {loading ? (
              <p className="text-sm text-gray-400 text-center py-10">Cargando...</p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">Sin notificaciones.</p>
            ) : (
              filtered.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition relative"
                >
                  {ICON_MAP[n.tipo] ?? ICON_MAP.default}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{n.mensaje}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.tiempo}</p>
                  </div>
                  {n.leido ? (
                    <span className="text-xs text-gray-400 shrink-0">Leído</span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-primary-500 mt-1 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

          {role && (
            <p className="text-xs text-gray-400 mt-4 text-center">
              📌 Las notificaciones se filtran según tu rol actual:{" "}
              <strong className="text-gray-600">{role}</strong>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
