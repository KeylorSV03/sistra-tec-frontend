import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Bell, CheckCircle, Clock, Package, Truck } from "lucide-react";

import { useAdminNav } from "../../hooks/useAdminNav.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import { donationService, notificationService } from "../../services/api";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import MetricCard from "../../components/ui/MetricCard";
import StatusBadge from "../../components/ui/StatusBadge";
import DonationIcon from "../../components/ui/DonationIcon";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";

export default function AdminDashboard() {
  usePageTitle("Panel de administración");
  const navItems = useAdminNav();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [activity, setActivity] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      donationService.listar({ limit: 5 }),
      notificationService.listar({ limit: 4 }),
    ])
      .then(([donationsRes, notificationsRes]) => {
        setDonations(donationsRes.data.donaciones ?? []);
        setActivity(notificationsRes.data.notificaciones ?? []);
        setUnreadCount(notificationsRes.data.pagination?.unread_count ?? 0);
      })
      .catch(() => {
        setDonations([]);
        setActivity([]);
        setUnreadCount(0);
      })
      .finally(() => setLoading(false));
  }, []);

  const unclassified = donations.filter((donation) => donation.estado === "Pendiente").length;

  const metrics = [
    {
      icon: <Package className="w-5 h-5 text-primary-500" />,
      value: donations.length,
      label: "Total recibidas",
      trendLabel: "+4 hoy",
    },
    {
      icon: <Clock className="w-5 h-5 text-yellow-500" />,
      value: unclassified,
      label: "Sin clasificar",
      trendLabel: "Requiere atención",
      alert: unclassified > 0,
    },
    {
      icon: <Truck className="w-5 h-5 text-orange-500" />,
      value: donations.filter((donation) => donation.estado === "En tránsito").length,
      label: "En tránsito",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      value: donations.filter((donation) => donation.estado === "Entregado").length,
      label: "Entregadas hoy",
      trendLabel: "↑ 20%",
    },
  ];

  return (
    <DashboardLayout sidebar={<Sidebar navItems={navItems} />}>
      <PageHeader
        title="Panel de administración"
        subtitle={`Resumen de actividad del sistema · Hoy, ${new Date().toLocaleDateString("es-CR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`}
        action={
          <div className="flex items-center gap-3">
            <Link
              to="/admin/notifications"
              aria-label={`Ver notificaciones: ${unreadCount} sin leer`}
              className="relative focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-xl"
            >
              <div className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition">
                <Bell aria-hidden="true" className="w-4 h-4 text-gray-600" />
              </div>
              {unreadCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
            <Button onClick={() => navigate("/admin/donations")}>
              Ver todas las donaciones
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Donaciones recientes</h2>
            <Link
              to="/admin/donations"
              aria-label="Ver todas las donaciones recientes"
              className="text-sm text-primary-600 hover:underline flex items-center gap-1"
            >
              Ver todas <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <p role="status" className="text-sm text-gray-600 text-center py-6">
              Cargando...
            </p>
          ) : donations.length === 0 ? (
            <p className="text-sm text-gray-600 text-center py-6">Sin donaciones recientes.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100"
                >
                  <DonationIcon size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-800 truncate">{donation.tipoDonacion}</p>
                      <span className="text-xs text-gray-600 font-mono">{donation.id}</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {donation.donante} · {donation.fecha}
                    </p>
                  </div>
                  <StatusBadge status={donation.estado} />
                  <Button
                    variant="secondary"
                    className="!text-xs !px-3 !py-1.5"
                    onClick={() => navigate("/admin/donations")}
                    aria-label={`Gestionar donación ${donation.id}, ${donation.tipoDonacion}`}
                  >
                    Gestionar donación
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
            <span aria-hidden="true">⚡</span> Actividad reciente
          </h2>
          <div className="flex flex-col gap-4">
            {loading ? (
              <p role="status" className="text-sm text-gray-600">Cargando...</p>
            ) : activity.length === 0 ? (
              <p className="text-sm text-gray-600">Sin actividad reciente.</p>
            ) : (
              activity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <DonationIcon size="sm" />
                  <div>
                    <p className="text-sm text-gray-700">{item.mensaje}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{item.tiempo}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
