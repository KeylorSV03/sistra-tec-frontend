import { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

import { useAdminNav } from "../../hooks/useAdminNav.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import { donationService } from "../../services/api";
import { STATUS_OPTIONS, ALL_STATUSES } from "../../utils/donationStatus";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import DonationIcon from "../../components/ui/DonationIcon";

export default function AdminDonationsPage() {
  usePageTitle("Gestión de donaciones");
  const navItems = useAdminNav();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    donationService
      .listar()
      .then((res) => setDonations(res.data.donaciones ?? []))
      .catch(() => setDonations([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return donations.filter((d) => {
      const matchStatus = !statusFilter || d.estado === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        d.id?.toLowerCase().includes(q) ||
        d.donante?.toLowerCase().includes(q) ||
        d.tipoDonacion?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [donations, search, statusFilter]);

  const handleStateChange = async (id, newState) => {
    if (!newState) return;
    try {
      await donationService.cambiarEstado(id, newState);
      setDonations((prev) =>
        prev.map((d) => (d.id === id ? { ...d, estado: newState } : d))
      );
      toast.success(`Estado actualizado a "${newState}"`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar navItems={navItems} />}>
      <PageHeader
        title="Gestión de donaciones"
        subtitle={`${donations.length} donaciones en el sistema`}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              aria-label="Buscar donaciones por ID, donante o tipo"
              placeholder="Buscar por ID, donante o tipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <div className="relative">
            <select
              aria-label="Filtrar donaciones por estado"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <option value="">Todos los estados</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <div
            aria-label="Filtro de fecha no disponible"
            className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500"
          >
            <span aria-hidden="true">📅</span> Fecha desde — hasta
          </div>
          <button
            type="button"
            disabled
            aria-label="Más filtros (próximamente)"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 opacity-50 cursor-not-allowed"
          >
            Más filtros
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p role="status" className="text-sm text-gray-600 text-center py-10">Cargando...</p>
        ) : (
          <table className="w-full text-sm">
            <caption className="sr-only">Listado de donaciones del sistema</caption>
            <thead>
              <tr className="text-xs text-gray-600 uppercase tracking-wider border-b border-gray-100">
                {["ID", "Donante", "Tipo", "Cantidad", "Fecha", "Estado", "Cambiar estado"].map(
                  (h) => (
                    <th key={h} scope="col" className="text-left pb-3 font-medium">{h}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 text-gray-700 font-mono text-xs">{d.id}</td>
                  <td className="py-4">
                    <p className="font-medium text-gray-800">{d.donante}</p>
                    <p className="text-xs text-gray-600">{d.correoDonante}</p>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <DonationIcon size="sm" />
                      <span className="text-gray-700">{d.tipoDonacion}</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">{d.cantidad} {d.unidadMedida}</td>
                  <td className="py-4 text-gray-500">{d.fecha}</td>
                  <td className="py-4">
                    <StatusBadge status={d.estado} />
                  </td>
                  <td className="py-4">
                    <div className="relative">
                      <select
                        aria-label={`Cambiar estado de la donacion ${d.id}`}
                        defaultValue=""
                        onChange={(e) => handleStateChange(d.id, e.target.value)}
                        className="appearance-none border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-xs text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                      >
                        <option value="" disabled>Cambiar...</option>
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    </div>
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
