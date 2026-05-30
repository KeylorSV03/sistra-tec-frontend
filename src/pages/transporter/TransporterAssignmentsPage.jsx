import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, User } from "lucide-react";

import { useTransporterNav } from "../../hooks/useTransporterNav.jsx";
import { transporterService } from "../../services/api";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import DonationIcon from "../../components/ui/DonationIcon";
import Button from "../../components/ui/Button";

export default function TransporterAssignmentsPage() {
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

  return (
    <DashboardLayout sidebar={<Sidebar navItems={navItems} />}>
      <PageHeader
        title="Mis asignaciones"
        subtitle={`${assignments.length} donaciones asignadas en total`}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-10">Cargando...</p>
        ) : assignments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">
            No tenés asignaciones activas.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-gray-50">
            {assignments.map((a) => (
              <div key={a.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <DonationIcon />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-medium text-gray-800">{a.tipoDonacion}</p>
                      <span className="text-xs text-gray-400 font-mono">{a.donacionId}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {a.cantidad} {a.unidad}
                    </p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {a.direccionRecogida}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Donante: {a.donante}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      → Destino: <strong>{a.destino}</strong>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <StatusBadge status={a.estado} />
                    <Button
                      className="!text-xs !px-3 !py-1.5"
                      onClick={() => navigate(`/transporter/assignments/${a.id}`)}
                    >
                      Gestionar →
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
