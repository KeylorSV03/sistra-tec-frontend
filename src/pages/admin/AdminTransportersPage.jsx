import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Mail, Phone, Search, UserPlus, X } from "lucide-react";
import { toast } from "react-toastify";

import { useAdminNav } from "../../hooks/useAdminNav.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import { transporterService } from "../../services/api";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/ui/StatusBadge";
import DonationIcon from "../../components/ui/DonationIcon";

function Avatar({ name, color = "bg-primary-600" }) {
  const initials = name
    ?.split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div
      role="img"
      aria-label={`Avatar de ${name}`}
      className={`w-9 h-9 ${color} rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0`}
    >
      {initials}
    </div>
  );
}

const AVATAR_COLORS = [
  "bg-primary-600",
  "bg-purple-700",
  "bg-teal-700",
  "bg-rose-700",
  "bg-amber-700",
];

export default function AdminTransportersPage() {
  usePageTitle("Transportistas");
  const navItems = useAdminNav();
  const navigate = useNavigate();
  const [transporters, setTransporters] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    transporterService
      .listar({ limit: 100 })
      .then((res) => setTransporters(res.data.transportistas ?? []))
      .catch(() => setTransporters([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return transporters.filter(
      (transporter) =>
        !search ||
        transporter.nombre?.toLowerCase().includes(query) ||
        transporter.correo?.toLowerCase().includes(query)
    );
  }, [transporters, search]);

  const active = transporters.filter((transporter) => transporter.estado === "Activo").length;
  const assigned = transporters.reduce(
    (acc, transporter) => acc + (transporter.asignacionesActivas ?? 0),
    0
  );

  const openAssignments = async (transporter) => {
    setSelectedTransporter(transporter);
    setAssignments([]);
    setLoadingAssignments(true);

    try {
      const res = await transporterService.asignacionesDeTransportista(transporter.apiId ?? transporter.id, {
        limit: 100,
      });
      setAssignments(res.data.asignaciones ?? []);
    } catch (err) {
      toast.error(err.message);
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const closeAssignments = () => {
    setSelectedTransporter(null);
    setAssignments([]);
  };

  return (
    <DashboardLayout sidebar={<Sidebar navItems={navItems} />}>
      <PageHeader
        title="Transportistas"
        subtitle={`${active} transportistas activos`}
        action={
          <Button onClick={() => navigate("/admin/create-transporter")}>
            <UserPlus aria-hidden="true" className="w-4 h-4" /> Crear transportista
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total registrados", value: transporters.length },
          { label: "Activos", value: active },
          { label: "Asignaciones en curso", value: assigned },
        ].map((metric) => (
          <div key={metric.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-sm text-gray-500 mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-5">
          <div className="relative">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              aria-label="Buscar transportista por nombre o correo"
              placeholder="Buscar transportista por nombre o correo..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
        </div>

        {loading ? (
          <p role="status" className="text-sm text-gray-600 text-center py-10">
            Cargando...
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-10">No hay transportistas que coincidan.</p>
        ) : (
          <table className="w-full text-sm">
            <caption className="sr-only">Listado de transportistas registrados</caption>
            <thead>
              <tr className="text-xs text-gray-600 uppercase tracking-wider border-b border-gray-100">
                {["Transportista", "Correo", "Teléfono", "Asignaciones activas", "Estado", "Acción"].map((heading) => (
                  <th key={heading} scope="col" className="text-left pb-3 font-medium">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((transporter, index) => (
                <tr key={transporter.id} className="hover:bg-gray-50 transition">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={transporter.nombre} color={AVATAR_COLORS[index % AVATAR_COLORS.length]} />
                      <div>
                        <p className="font-medium text-gray-800">{transporter.nombre}</p>
                        <p className="text-xs text-gray-600">{transporter.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Mail aria-hidden="true" className="w-3.5 h-3.5 text-gray-400" />
                      {transporter.correo}
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Phone aria-hidden="true" className="w-3.5 h-3.5 text-gray-400" />
                      {transporter.telefono || "-"}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${(transporter.asignacionesActivas ?? 0) > 0 ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-700"}`}>
                        {transporter.asignacionesActivas ?? 0}
                      </span>
                      <span className="text-xs text-gray-600">
                        {(transporter.asignacionesActivas ?? 0) > 0 ? "en curso" : "Sin asignaciones"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${transporter.estado === "Activo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${transporter.estado === "Activo" ? "bg-green-500" : "bg-gray-400"}`} />
                      {transporter.estado}
                    </span>
                  </td>
                  <td className="py-4">
                    <Button
                      type="button"
                      variant="secondary"
                      className="!text-xs !px-3 !py-1.5"
                      onClick={() => openAssignments(transporter)}
                      aria-label={`Ver asignaciones de ${transporter.nombre}`}
                    >
                      <ClipboardList aria-hidden="true" className="w-3.5 h-3.5" />
                      Ver asignaciones
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedTransporter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-100" role="dialog" aria-modal="true" aria-labelledby="assignments-title">
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <h2 id="assignments-title" className="text-lg font-bold text-gray-900">
                  Asignaciones de {selectedTransporter.nombre}
                </h2>
                <p className="text-sm text-gray-500">{selectedTransporter.correo}</p>
              </div>
              <button
                type="button"
                onClick={closeAssignments}
                aria-label="Cerrar modal de asignaciones"
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <X aria-hidden="true" className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {loadingAssignments ? (
                <p role="status" className="text-sm text-gray-600 text-center py-8">Cargando asignaciones...</p>
              ) : assignments.length === 0 ? (
                <p className="text-sm text-gray-600 text-center py-8">Este transportista no tiene asignaciones.</p>
              ) : (
                <div className="max-h-[420px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <caption className="sr-only">Asignaciones del transportista seleccionado</caption>
                    <thead>
                      <tr className="text-xs text-gray-600 uppercase tracking-wider border-b border-gray-100">
                        {["Donación", "Cantidad", "Destino", "Estado"].map((heading) => (
                          <th key={heading} scope="col" className="text-left pb-3 font-medium">
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {assignments.map((assignment) => (
                        <tr key={`${assignment.id}-${assignment.deliveryId ?? ""}`}>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <DonationIcon size="sm" />
                              <div>
                                <p className="font-medium text-gray-800">{assignment.tipoDonacion}</p>
                                <p className="text-xs text-gray-600 font-mono">{assignment.donacionId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-gray-600">
                            {assignment.cantidad} {assignment.unidad}
                          </td>
                          <td className="py-4 text-gray-600">
                            <p>{assignment.destino}</p>
                            <p className="text-xs text-gray-600">{assignment.direccionRecogida}</p>
                          </td>
                          <td className="py-4">
                            <StatusBadge status={assignment.estado} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
