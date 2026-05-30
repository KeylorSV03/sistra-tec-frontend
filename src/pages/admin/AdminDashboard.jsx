import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Clock, Truck, CheckCircle, Bell, ArrowRight } from "lucide-react";

import { useAdminNav } from "../../hooks/useAdminNav.jsx";
import { donationService } from "../../services/api";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import MetricCard from "../../components/ui/MetricCard";
import StatusBadge from "../../components/ui/StatusBadge";
import DonationIcon from "../../components/ui/DonationIcon";
import FilterTabs from "../../components/ui/FilterTabs";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";

const TABS = [
  { key: "Todas", label: "Todas" },
  { key: "Pendiente", label: "Pendiente" },
  { key: "Recibido", label: "Recibido" },
  { key: "Clasificado", label: "Clasificado" },
  { key: "En tránsito", label: "En tránsito" },
  { key: "Entregado", label: "Entregado" },
];

const MOCK_ACTIVITY = [
  { icon: <DonationIcon size="sm" />, msg: "Nueva donación registrada por Ana Jiménez (DON-005)", time: "Hace 3h" },
  { icon: <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center text-base">🚛</div>, msg: "Luis Mora confirmó recogida de DON-001", time: "Hace 5h" },
  { icon: <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">✓</div>, msg: "DON-002 marcada como entregada", time: "Hace 1d" },
  { icon: <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">🔔</div>, msg: "Roberto Salas registró DON-004 (Agua potable, 200L)", time: "Hace 1d" },
];

export default function AdminDashboard() {
  const navItems = useAdminNav();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState("Todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    donationService
      .listar({ limit: 5 })
      .then((res) => setDonations(res.data.donaciones ?? []))
      .catch(() => setDonations([]))
      .finally(() => setLoading(false));
  }, []);

  const unclassified = donations.filter((d) => d.estado === "Pendiente").length;

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
      value: donations.filter((d) => d.estado === "En tránsito").length,
      label: "En tránsito",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      value: donations.filter((d) => d.estado === "Entregado").length,
      label: "Entregadas hoy",
      trendLabel: "↑ 20%",
    },
  ];

  const filtered =
    activeTab === "Todas"
      ? donations
      : donations.filter((d) => d.estado === activeTab);

  return (
    <DashboardLayout sidebar={<Sidebar navItems={navItems} />}>
      <PageHeader
        title="Panel de administración"
        subtitle={`Resumen de actividad del sistema · Hoy, ${new Date().toLocaleDateString("es-CR", { day: "numeric", month: "long", year: "numeric" })}`}
        action={
          <div className="flex items-center gap-3">
            <Link to="/admin/notifications" className="relative">
              <div className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition">
                <Bell className="w-4 h-4 text-gray-600" />
              </div>
              {unclassified > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unclassified}
                </span>
              )}
            </Link>
            <Button onClick={() => navigate("/admin/donations")}>
              Ver todas las donaciones
            </Button>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent donations */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Donaciones recientes</h2>
            <Link to="/admin/donations" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mb-4">
            <FilterTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
          </div>

          {loading ? (
            <p className="text-sm text-gray-400 text-center py-6">Cargando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Sin donaciones en esta categoría.</p>
          ) : (
            <div className="flex flex-col divide-y divide-gray-50">
              {filtered.map((d) => (
                <div key={d.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <DonationIcon size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-800 truncate">{d.tipoDonacion}</p>
                      <span className="text-xs text-gray-400 font-mono">{d.id}</span>
                    </div>
                    <p className="text-xs text-gray-400">{d.donante} · {d.fecha}</p>
                  </div>
                  <StatusBadge status={d.estado} />
                  <Button
                    variant="secondary"
                    className="!text-xs !px-3 !py-1.5"
                    onClick={() => navigate("/admin/donations")}
                  >
                    Gestionar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
            <span>⚡</span> Actividad reciente
          </h2>
          <div className="flex flex-col gap-4">
            {MOCK_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                {a.icon}
                <div>
                  <p className="text-sm text-gray-700">{a.msg}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
