import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, User, Truck, Package } from "lucide-react";

import { useTransporterNav } from "../../hooks/useTransporterNav.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import { transporterService } from "../../services/api";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import DonationIcon from "../../components/ui/DonationIcon";
import Button from "../../components/ui/Button";

const isDeliveryDone = (assignment) => {
  const tipo = assignment.tipoEntrega;
  const estado = assignment.estado;
  if (tipo === "pickup") {
    return ["Recibido", "Clasificado", "En tránsito", "Entregado"].includes(estado);
  }
  return estado === "Entregado";
};

const DELIVERY_TYPE_LABEL = {
  pickup: "Recolección",
  dropoff: "Entrega a beneficiario",
};

export default function TransporterAssignmentsPage() {
  usePageTitle("Mis asignaciones");
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

  const pending = assignments.filter((a) => !isDeliveryDone(a));
  const done = assignments.filter((a) => isDeliveryDone(a));

  return (
    <DashboardLayout sidebar={<Sidebar navItems={navItems} />}>
      <PageHeader
        title="Mis asignaciones"
        subtitle={`${pending.length} pendiente${pending.length !== 1 ? "s" : ""} · ${done.length} completada${done.length !== 1 ? "s" : ""}`}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {loading ? (
          <p role="status" className="text-sm text-gray-600 text-center py-10">Cargando...</p>
        ) : assignments.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-10">No tenés asignaciones activas.</p>
        ) : (
          <div className="flex flex-col divide-y divide-gray-50">
            {/* Pending first */}
            {pending.length > 0 && (
              <>
                {pending.map((a) => (
                  <AssignmentCard key={`${a.id}-${a.tipoEntrega}`} assignment={a} navigate={navigate} done={false} />
                ))}
              </>
            )}

            {/* Completed */}
            {done.length > 0 && (
              <>
                {pending.length > 0 && (
                  <p className="pt-5 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Completadas
                  </p>
                )}
                {done.map((a) => (
                  <AssignmentCard key={`${a.id}-${a.tipoEntrega}`} assignment={a} navigate={navigate} done={true} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function AssignmentCard({ assignment: a, navigate, done }) {
  const typeLabel = DELIVERY_TYPE_LABEL[a.tipoEntrega] ?? a.tipoEntrega;
  const isPickup = a.tipoEntrega === "pickup";

  return (
    <div className={`py-5 first:pt-0 last:pb-0 ${done ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-4">
        <DonationIcon />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="font-medium text-gray-800">{a.tipoDonacion}</p>
            <span className="text-xs text-gray-600 font-mono">{a.donacionId}</span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                isPickup
                  ? "bg-orange-50 text-orange-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {isPickup ? (
                <Package aria-hidden="true" className="w-3 h-3" />
              ) : (
                <Truck aria-hidden="true" className="w-3 h-3" />
              )}
              {typeLabel}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {a.cantidad} {a.unidad}
          </p>
          <div className="flex items-center gap-4 mt-2 flex-wrap text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin aria-hidden="true" className="w-3 h-3" />
              {a.direccionRecogida || "—"}
            </span>
            <span className="flex items-center gap-1">
              <User aria-hidden="true" className="w-3 h-3" />
              Donante: {a.donante}
            </span>
          </div>
          {a.destino && (
            <p className="text-xs text-gray-500 mt-1">
              → Destino: <strong>{a.destino}</strong>
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={a.estado} />
          {!done && (
            <Button
              className="!text-xs !px-3 !py-1.5"
              onClick={() => navigate(`/transporter/assignments/${a.id}`)}
              aria-label={`Gestionar asignación ${a.donacionId}, ${a.tipoDonacion}`}
            >
              Gestionar
            </Button>
          )}
          {done && (
            <span className="text-xs text-gray-400 font-medium">Completada</span>
          )}
        </div>
      </div>
    </div>
  );
}
