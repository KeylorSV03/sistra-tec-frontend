import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Package, Truck, CheckCircle, Clock, Plus, ArrowRight } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useDonorNav } from "../../hooks/useDonorNav.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import { donationService } from "../../services/api";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import MetricCard from "../../components/ui/MetricCard";
import StatusBadge from "../../components/ui/StatusBadge";
import DonationIcon from "../../components/ui/DonationIcon";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";

export default function DonorDashboard() {
  usePageTitle("Mi panel");
  const { user } = useAuth();
  const navItems = useDonorNav();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    donationService
      .misDonaciones({ limit: 3 })
      .then((res) => setDonations(res.data.donaciones ?? []))
      .catch(() => setDonations([]))
      .finally(() => setLoading(false));
  }, []);

  const metrics = [
    {
      icon: <Package className="w-5 h-5 text-primary-500" />,
      value: donations.length,
      label: "Total de donaciones",
      trendLabel: "+2 este mes",
    },
    {
      icon: <Truck className="w-5 h-5 text-orange-500" />,
      value: donations.filter((d) => d.estado === "En tránsito").length,
      label: "En tránsito",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      value: donations.filter((d) => d.estado === "Entregado").length,
      label: "Entregadas",
      trendLabel: "80% de éxito",
    },
    {
      icon: <Clock className="w-5 h-5 text-gray-400" />,
      value: donations.filter((d) =>
        ["Pendiente", "Recibido", "Clasificado"].includes(d.estado)
      ).length,
      label: "En proceso",
    },
  ];

  const firstName = user?.nombre?.split(" ")[0] ?? "Donante";

  return (
    <DashboardLayout sidebar={<Sidebar navItems={navItems} />}>
      <PageHeader
        title={<>¡Hola, {firstName}! <span aria-hidden="true">👋</span></>}
        subtitle="Aquí encontrás el resumen de tus donaciones. Gracias por tu generosidad."
        action={
          <Button onClick={() => navigate("/donor/register-donation")}>
            <Plus aria-hidden="true" className="w-4 h-4" />
            Registrar donación
          </Button>
        }
      />

      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-6 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-xl mb-1">¡Gracias por ayudar!</h2>
          <p className="text-white text-sm mt-1">Con tu aporte hacemos la diferencia. Registra más artículos cuando lo desees.</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate("/donor/register-donation")}
          className="shrink-0 !text-primary-600"
        >
          Registrar ahora <ArrowRight aria-hidden="true" className="w-4 h-4" />
        </Button>
      </div>

      {/* Recent donations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 text-lg">Donaciones recientes</h2>
          <Link
            to="/donor/my-donations"
            aria-label="Ver todas mis donaciones"
            className="text-sm text-primary-600 hover:underline flex items-center gap-1"
          >
            Ver todas <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <p role="status" className="text-sm text-gray-600 text-center py-6">Cargando...</p>
        ) : donations.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-6">
            Aún no tenés donaciones registradas.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-gray-50">
            {donations.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <DonationIcon />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {d.tipoDonacion}
                  </p>
                  <p className="text-xs text-gray-600">
                    {d.cantidad} {d.unidadMedida} · {d.fecha}
                  </p>
                </div>
                <StatusBadge status={d.estado} />
                <Link
                  to={`/donor/my-donations`}
                  aria-label={`Ver detalle de donación ${d.id}, ${d.tipoDonacion}`}
                  className="text-xs text-primary-600 hover:underline shrink-0"
                >
                  Ver detalle
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
