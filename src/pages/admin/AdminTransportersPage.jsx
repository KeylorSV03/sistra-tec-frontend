import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, Mail, Phone } from "lucide-react";

import { useAdminNav } from "../../hooks/useAdminNav.jsx";
import { transporterService } from "../../services/api";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";

function Avatar({ name, color = "bg-primary-500" }) {
  const initials = name
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className={`w-9 h-9 ${color} rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0`}>
      {initials}
    </div>
  );
}

const AVATAR_COLORS = [
  "bg-primary-500",
  "bg-purple-500",
  "bg-teal-500",
  "bg-rose-500",
  "bg-amber-500",
];

export default function AdminTransportersPage() {
  const navItems = useAdminNav();
  const navigate = useNavigate();
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    transporterService
      .listar()
      .then((res) => setTransporters(res.data.transportistas ?? []))
      .catch(() => setTransporters([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return transporters.filter(
      (t) =>
        !search ||
        t.nombre?.toLowerCase().includes(q) ||
        t.correo?.toLowerCase().includes(q)
    );
  }, [transporters, search]);

  const active = transporters.filter((t) => t.estado === "Activo").length;
  const assigned = transporters.reduce((acc, t) => acc + (t.asignacionesActivas ?? 0), 0);

  return (
    <DashboardLayout sidebar={<Sidebar navItems={navItems} />}>
      <PageHeader
        title="Transportistas"
        subtitle={`${active} transportistas activos`}
        action={
          <Button onClick={() => navigate("/admin/create-transporter")}>
            <UserPlus className="w-4 h-4" /> Crear transportista
          </Button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total registrados", value: transporters.length },
          { label: "Activos", value: active },
          { label: "Asignaciones en curso", value: assigned },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-gray-900">{m.value}</p>
            <p className="text-sm text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar transportista por nombre o correo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400 text-center py-10">Cargando...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                {["Transportista", "Correo", "Teléfono", "Asignaciones activas", "Estado", "Acción"].map(
                  (h) => <th key={h} className="text-left pb-3 font-medium">{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((t, i) => (
                <tr key={t.id} className="hover:bg-gray-50 transition">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={t.nombre} color={AVATAR_COLORS[i % AVATAR_COLORS.length]} />
                      <div>
                        <p className="font-medium text-gray-800">{t.nombre}</p>
                        <p className="text-xs text-gray-400">{t.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      {t.correo}
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {t.telefono}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${(t.asignacionesActivas ?? 0) > 0 ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500"}`}>
                        {t.asignacionesActivas ?? 0}
                      </span>
                      <span className="text-xs text-gray-400">
                        {(t.asignacionesActivas ?? 0) > 0 ? "en curso" : "Sin asignaciones"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${t.estado === "Activo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${t.estado === "Activo" ? "bg-green-500" : "bg-gray-400"}`} />
                      {t.estado}
                    </span>
                  </td>
                  <td className="py-4">
                    <Button variant="secondary" className="!text-xs !px-3 !py-1.5">
                      Ver asignaciones
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
