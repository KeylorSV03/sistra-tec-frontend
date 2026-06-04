import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Truck, CheckCircle, MapPin, User } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useTransporterNav } from "../../hooks/useTransporterNav.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import { transporterService } from "../../services/api";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import MetricCard from "../../components/ui/MetricCard";
import StatusBadge from "../../components/ui/StatusBadge";
import DonationIcon from "../../components/ui/DonationIcon";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";

export default function TransporterDashboard() {
  usePageTitle("Panel de transportista");
  const { user } = useAuth();
  const navItems = useTransporterNav();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transporterService
      .misAsignaciones()
      .then((res) => setAssignments(res.data.asignaciones ?? []))
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, []);

  const inTransit = assignments.filter((a) => a.estado === "En tránsito");
  const pending = assignments.filter((a) => !["En tránsito", "Entregado"].includes(a.estado));
  const delivered = assignments.filter((a) => a.estado === "Entregado");

  const firstName = user?.nombre?.split(" ")[0] ?? "Transportista";

  return (
    <DashboardLayout sidebar={<Sidebar navItems={navItems} />}>
      <PageHeader
        title={<span className="flex items-center gap-2">¡Hola, {firstName}! <span aria-hidden="true">🚛</span></span>}
        subtitle="Tus asignaciones de hoy. Verificá el estado y comenzá las entregas."
      />

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard
          icon={<Clock className="w-5 h-5 text-yellow-500" />}
          value={pending.length}
          label="Pendientes de recogida"
        />
        <section aria-label={`En tránsito: ${inTransit.length}`} className="bg-white rounded-2xl p-5 shadow-sm border border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <Truck aria-hidden="true" className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{inTransit.length}</p>
          <p className="text-sm text-gray-500 mt-0.5">En tránsito</p>
          {inTransit.length > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-orange-800 font-medium mt-1">
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Activo ahora
            </span>
          )}
        </section>
        <MetricCard
          icon={<CheckCircle className="w-5 h-5 text-green-500" />}
          value={delivered.length}
          label="Entregadas hoy"
        />
      </div>

      {/* Current assignments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="mb-4">
          <h2 className="font-bold text-gray-900 text-lg">Mis asignaciones actuales</h2>
          <p className="text-sm text-gray-600">{assignments.length} donaciones asignadas en total</p>
        </div>

        {loading ? (
          <p role="status" className="text-sm text-gray-600 text-center py-6">Cargando...</p>
        ) : assignments.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-6">
            No tenés asignaciones en este momento.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-gray-50">
            {assignments.map((a) => (
              <div key={a.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <DonationIcon />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-800">{a.tipoDonacion}</p>
                      <span className="text-xs text-gray-600 font-mono">{a.donacionId}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 flex-wrap">
                      <span>{a.cantidad} {a.unidad}</span>
                      <span className="flex items-center gap-1">
                        <MapPin aria-hidden="true" className="w-3 h-3" />
                        {a.direccionRecogida}
                      </span>
                      <span className="flex items-center gap-1">
                        <User aria-hidden="true" className="w-3 h-3" />
                        Donante: {a.donante}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      → Destino: <strong>{a.destino}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={a.estado} />
                    <Button
                      className="!text-xs !px-3 !py-1.5"
                      onClick={() => navigate(`/transporter/assignments/${a.id}`)}
                      aria-label={`Gestionar asignación ${a.donacionId}, ${a.tipoDonacion}`}
                    >
                      Gestionar asignación
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          <span aria-hidden="true">📋</span> Instrucciones del transportista
        </p>
        <ol className="flex flex-col gap-1.5">
          {[
            "Recogé la donación en la dirección indicada.",
            "Confirmá la recogida en el sistema antes de partir.",
            "Al llegar al destino, confirmá la entrega con el beneficiario.",
          ].map((step, i) => (
            <li key={i} className="text-sm text-primary-600">
              <span aria-hidden="true">{i + 1}. </span>{step}
            </li>
          ))}
        </ol>
      </div>
    </DashboardLayout>
  );
}
